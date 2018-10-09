const typeDefs = `
    type Node {
        nodeType: String
        isSelected: Boolean
    }

    type Query {
        getNodes(location: String!, nodeType: String): [Node]
    }

    type Mutation {
        updateSelectedNode(id: ID, isSelected: Boolean): Node
    }
`;

export default typeDefs;
