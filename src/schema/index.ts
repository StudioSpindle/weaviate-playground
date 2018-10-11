const typeDefs = `
    type Node {
        nodeType: String
        isSelected: Boolean
    }

    type NodesFilters {
        nodeLocation: String
        nodeType: String
    }

    type Query {
        nodes(isSelected: Boolean, nodeLocation: String!, nodeType: String): [Node]
        nodesFilters: NodeFilters
    }

    type Mutation {
        updateNodesFilters(nodeLocation: String, nodeType: String): NodesFilters
        updateSelectedNode(id: ID, isSelected: Boolean): Node
    }
`;

export default typeDefs;
