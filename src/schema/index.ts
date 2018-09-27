const typeDefs = `
    type Node {
        isSelected: Boolean
    }

    type Query {
        nodes: [Node]
    }

    type Mutation {
        updateSelectedNode(id: ID, isSelected: Boolean): Node
    }
`;

export default typeDefs;
