<!-- | Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the 
raw Markdown line up prettily. You can also use inline Markdown. -->
## users
| Variable      | Type           | Required |
| ------------- |:--------------:| --------:|
| id            | Auto-generated |     True |
| farmID        | Integer (FKEY) |    False |
| isFarmer      | Boolean        |     True |
| email         | String         |     True |
| username      | String         |     True |
| password      | String         |     True |
| name          | String         |     True |
| zipCode       | Integer        |     True |
| addressStreet | String         |    False |
| addressCity   | String         |    False |
| addressState  | String         |    False |
>farmID optional, required if isFarmer true. There will be a get all farms endpoint where you will get this data from.
>zipCode: 5 digits

## next
| Variable      | Type           | Required |
| ------------- |:--------------:| --------:|