# Adjustments from reference implementation
RMLWeaver-JS only supports input data files in CSV format. 
Thus, we adapted the [reference test
cases](https://github.com/herminiogg/ShExML/tree/master/src/test/scala/com/herminiogarcia/shexml)
of ShExML to utilize only CSV files as input. 
Since the reference test cases are more of an integration test, where all 
the features of ShExML are tested together, we also split up the existing 
test cases into multiple smaller test cases for a granular evaluation. 


# Results
RMLWeaver-JS generates the same RDF knowledge graph as the reference ShExML
mapping engine for all the test cases. 
