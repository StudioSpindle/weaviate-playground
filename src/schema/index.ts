const typeDefs = `
    type Class {
        id: String!
        instance: String!
        isSelected: Boolean!
        name: String!
        classLocation: String!
        classType: String!
        filters: String!
    }

    type Link {
        id: String!
        isActive: Boolean!
        source: String!
        target: String!
        value: String!
    }

    type Canvas {
        classIds: [String]
        hasActiveSourceLinks: Boolean
        hasActiveTargetLinks: Boolean
        links: [Link]
        selectedClasses: [String]
        selectedClass: Class
        queryString: String
        zoom: Int
    }

    type ClassesFilters {
        classLocation: String
        classType: String
        queryString: String
    }

    type Query {
        classesFilters: ClassFilters
        canvas: Canvas
        class(id: String!): Class
        classes: [Class]
        queryString: string;
    }

    type Mutation {
        toggleClassSelectionLibrary(id: String!): Class
        updateClass(id: String!, instance: String!, name: String!, classLocation: String!, classType: String!, filters: String!)
        updateClassSelectionCanvas(id: String!): Canvas
        updateClassesFilters(classLocation: String, classType: String, queryString: String): ClassesFilters
        updateClassSelection(typename: String!): Canvas
        updateMetaCount(className: String!, addition: Boolean!)
        updateQueryString(hasActiveSourceLinks: Boolean!, hasActiveTargetLinks: Boolean!, queryString: String!): String
    }
`;

export default typeDefs;
