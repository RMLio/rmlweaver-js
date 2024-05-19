#!/usr/bin/env python3


import os
import psutil
from typing import Optional
from timeout_decorator import timeout, TimeoutError  # type: ignore
from bench_executor.container import Container
from bench_executor.logger import Logger
from rdflib import Graph, BNode, Namespace, Literal, RDF
import subprocess

R2RML = Namespace('http://www.w3.org/ns/r2rml#')
RML = Namespace('http://semweb.mmlab.be/ns/rml#')
D2RQ = Namespace('http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#')
QL = Namespace("http://semweb.mmlab.be/ns/ql#")

VERSION = '1.2.7'
TIMEOUT = 6 * 3600  # 6 hours

ALGEMAPLOOMRS_BINARY = "/home/triver/Documents/IDLAB/applications/algemaploom-rs/target/release/translator"

class MeamerJS(Container):
    """RMLMapper container for executing R2RML and RML mappings."""


    def __init__(self, data_path: str, config_path: str, directory: str,
                 verbose: bool):
        """Creates an instance of the RMLMapper class.

        Parameters
        ----------
        data_path : str
            Path to the data directory of the case.
        directory : str
            Path to the directory to store logs.
        """

        self._data_path = os.path.abspath(data_path)
        self._config_path = os.path.abspath(config_path)
        self._logger = Logger(__name__, directory, verbose)
        self._verbose = verbose

        os.makedirs(os.path.join(self._data_path,'shared', 'MeamerJS'), exist_ok=True)
        super().__init__(f'tr1ver/meamerjs:v{VERSION}', 'meamer_js',
                         self._logger,
                         volumes=[f'{self._data_path}/meamerjs:/data',
                                  f'{self._data_path}/shared:/data/shared'])

    @timeout(TIMEOUT)
    def _execute_with_timeout(self, arguments: list) -> bool:
        """Execute a mapping with a provided timeout.

        Returns
        -------
        success : bool
            Whether the execution was successfull or not.
        """

        cmd = "npm run execute_dot -- " + " -".join(arguments)
        print(cmd + " => RUNNING THIS COMMAND")
        return self.run_and_wait_for_exit(cmd)


    def execute(self, arguments: list) -> bool:
        """Execute RMLMapper with given arguments.

        Parameters
        ----------
        arguments : list
            Arguments to supply to RMLMapper.

        Returns
        -------
        success : bool
            Whether the execution succ
run_benchmark()eeded or not.
        """
        try:
            return self._execute_with_timeout(arguments)
        except TimeoutError:
            msg = f'Timeout ({TIMEOUT}s) reached for RMLMapper'
            self._logger.warning(msg)

        return False
    def execute_mapping_no_translate(self,
                        mapping_file: str) -> bool:
        dirname = os.path.join(self._data_path, 'shared')
        print(dirname)
        print(mapping_file)
        # .rml.ttl -> .dot
        cmd = ALGEMAPLOOMRS_BINARY + " folder " + dirname
	
        print(cmd)
        translation_process = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                                               shell=True)
                                               
        translation_process.communicate()  # Wait for Algemaploom-rs to finish translating the rml file. 

        arguments = ["/data/shared/mapping.r2ml.dot -skipProjection"]  # Enable duplicate removal

        return self.execute(arguments)
        
    def execute_mapping(self,
                        mapping_file: str) -> bool:
        """Execute a mapping file with RMLMapper.

        N-Quads and N-Triples are currently supported as serialization
        format for RMLMapper.

        Parameters
        ----------
        mapping_file : str
            Path to the mapping file to execute.

        Returns
        -------
        success : bool
            Whether the execution was successfull or not.
        """
        # Compatibility with R2RML mapping files
        # Replace rr:logicalTable with rml:logicalSource + D2RQ description
        # and rr:column with rml:reference
        g = Graph()

        g.bind('rr', R2RML)
        g.bind('rml', RML)
        g.bind('d2rq', D2RQ)
        g.bind('rdf', RDF)
        g.bind('ql', QL)

        g.parse(os.path.join(self._data_path, 'shared',
                             os.path.basename(mapping_file)))

        # rr:logicalTable --> rml:logicalSource
        for triples_map_iri, p, o in g.triples((None, RDF.type,
                                                R2RML.TriplesMap)):
            logical_source_iri = BNode()
            d2rq_rdb_iri = BNode()
            logical_table_iri = g.value(triples_map_iri,
                                        R2RML.logicalTable)
            if logical_table_iri is None:
                break

            table_name_literal = g.value(logical_table_iri,
                                         R2RML.tableName)
            if table_name_literal is None:
                break

            # Create a new BNode for logicalSource
            logical_source_iri = BNode()

            # Add triples for rml:logicalSource
            g.add((triples_map_iri, RML.logicalSource, logical_source_iri))
            g.add((logical_source_iri, RML.source, Literal("../" + str(table_name_literal) + ".csv"))) # Translate logical table to csv file. 
                                                                                         # All benchmarks have logical table name the same as the csv file with the contained data
            g.add((logical_source_iri, RML.referenceFormulation, QL.CSV))
            
            g.remove((triples_map_iri, R2RML.logicalTable,
                      logical_table_iri))
            g.remove((logical_table_iri, R2RML.tableName,
                      table_name_literal))
            g.remove((logical_table_iri, RDF.type, R2RML.LogicalTable))
            g.remove((logical_table_iri, R2RML.sqlVersion, R2RML.SQL2008))

        # rr:column --> rml:reference
        for s, p, o in g.triples((None, R2RML.column, None)):
            g.add((s, RML.reference, o))
            g.remove((s, p, o))

        destination = os.path.join(self._data_path, 'shared','MeamerJS',
                                   'mapping_converted.rml.ttl')

        g.serialize(destination=destination, format='turtle')

        # .rml.ttl -> .dot
        cmd = ALGEMAPLOOMRS_BINARY + " folder " + destination


        translation_process = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                                               shell=True)
        _, _ = translation_process.communicate()  # Wait for Algemaploom-rs to finish translating the rml file. 

        arguments = ["/data/shared/MeamerJS/mapping_converted.rml.dot -skipProjection -forceFileOutput=benchoutput.rq"]

        return self.execute(arguments)
