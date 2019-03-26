const axios = require('axios');
const {
    GraphQLObjectType, 
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');




// CustomerType
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt}
    })
});

// Root Query - Queries
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        // fetch individual customer
        customer: {
            type: CustomerType,
            args: {
                id:{type: GraphQLString}
            },
            resolve(parentValue, args){
                // returns promise
               return axios.get('http://localhost:3000/customers/' + args.id)
                // returns data object so map to response
                .then(res => res.data);
            }
        },
        // fetch all customers
        customers:{
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args){
                // returns promise
               return axios.get('http://localhost:3000/customers')
               // returns data object so map to response
               .then(res => res.data);
            }
        }
    }
    
});


// mutations - make changes to database
const mutation = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                // graphqlnonnull = required field
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/customers', {
                    name: args.name,
                    email: args.email,
                    age: args.age
                })
                    .then(res => res.data);
            }
        },
        deleteCustomer: {
            type: CustomerType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/customers/' + args.id) 
                    .then(res => res.data);
            }
        },
        editCustomer: {
            type: CustomerType,
            args: {
                // graphqlnonnull = required field
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/customers/' + args.id, args)
                    .then(res => res.data);
            }
        },
    }
})






module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
});