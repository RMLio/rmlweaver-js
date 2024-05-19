# Meamer-JS notes
## Implementations:
### Operator
Perform operations on the data and then pass it to the next operator using push()

### Executor
Uses RXJS streams where we represent Operators with subjects.
Objects/Strings are passed to the next operator.
Originally the project worked with Observables.
But I could not get these to work with Multicast streams(needed for fragmenter).

### Join
Joins work by first collecting both streams till completion. And then passing these to the executeJoin function.
The join operator itself will choose when to complete and push.

## Optimisations:
### Joins:
For now joins add the ptm_alias to all objects entering the join from the secondary input.     
It would possibly be more efficient to only add this to the respective fields that are duplicate.