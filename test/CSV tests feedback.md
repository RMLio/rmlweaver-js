# meamer-js Output of RML mapper tests

### RMLTC0000-CSV
Successfull test, dot operators also executed as expected.

### RMLTC0001a-CSV
Successfull test, dot operators also executed as expected.

### RMLTC0001b-CSV
Successfull test, dot operators also executed as expected.

### RMLTC0002a-CSV
Unsuccessful test, but operators worked as expected. The problem is probably somewhere in the translation.

### RMLTC0002b-CSV
Successfull test, dot operators also executed as expected.

### RMLTC0002c-CSV
Unsuccessful test, when a field is referenced that is not present in the object it should not output a value,
    according to this test.

### RMLTC0002e-CSV
Successfull test, file is not found. //TODO: Implement error detection in test function

### RMLTC0003c-CSV
Successfull test, dot operators also executed as expected.

### RMLTC0004a-CSV
!!
Unsuccessful test, extend operator 7 never receives values.  Operator 4 sends values to both target Operators.
Also not sure how triples must be outputted multiple outputting target operators.

### RMLTC0004b-CSV
Unimplemented dot graph.

### RMLTC0005a-CSV
Unsuccessful test.

### RMLTC0006a-CSV
Unsuccessful test, but operators worked as expected. The problem is probably somewhere in the translation.

### RMLTC0007a-CSV
Successfull test, dot operators also executed as expected.

### RMLTC0007b-CSV
Unsuccessful test, but operators worked as expected. The order of the output triples was switched during the translation.

### RMLTC0007c-CSV
Unsuccessful test, there is an error in translation(there are not enough triplesmaps).

### RMLTC0007d-CSV
Unsuccessful test, but operators worked as expected. The order of the output triples was switched during the translation.

### RMLTC0007b-CSV
Unsuccessful test, but operators worked as expected. 
One triple is missing in the serializer.

### RMLTC0007f-CSV
Unsuccessful test, but operators worked as expected. 
The order of the output triples was switched during the translation.

### RMLTC0007h-CSV
Unsuccessful test, when a field is referenced that is not present in the object it should not output a value,
    according to this test.
