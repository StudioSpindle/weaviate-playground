const typeDefs = `
    type __Type {
        isSelected: Boolean!
    }

    type Canvas {
        selectedNodes: [String]
        selectedNode: String
        zoom: Int
    }

    type NodesFilters {
        nodeLocation: String
        nodeType: String
        queryString: String
    }

    type Query {
        toggleLibraryNodeSelection(typename: String!, isSelected: Boolean!): Node
        nodesFilters: NodeFilters
        canvas: Canvas
        __type(name: String!): __Type
    }

    type Mutation {
        updateNodesFilters(nodeLocation: String, nodeType: String, queryString: String): NodesFilters
        updateNodeSelection(typename: String!): Canvas
    }
`;

export default typeDefs;
