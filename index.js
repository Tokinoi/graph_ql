import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
type Book {
    title: String!
    author: Author!
    category: Category!
}

type Category {
    id: Int!
    name: String!
}

type Author {
    id: Int!
    name: String!
    books: [Book!]!
}

type Query {
    books: [Book!]!
    authors: [Author!]!
    categories: [Category!]!   
}
`;

const books = [
    {
        title: 'The Awakening',
        authorID: 1,
        categoryId: 2
    },
    {
        title: 'City of Glass',
        authorID: 2,
        categoryId: 1
    },
];

const authors = [
    {
        id: 1,
        name: 'Jean',
    },
    {
        id: 2,
        name: 'Seb',
    },
];

const categories = [
    {
        id: 1,
        name: 'Horreur'
    },
    {
        id: 2,
        name: 'Romance'
    }
];

const resolvers = {
    Query: {
        books: () => books,
        authors: () => authors,
        categories: () => categories,   // Vous aviez déjà ce resolver, il fonctionnera maintenant
    },

    Book: {
        author: (parent) => authors.find((author) => author.id === parent.authorID),
        category: (parent) => categories.find((category) => category.id === parent.categoryId),
    },

    Author: {
        books: (parent) => books.filter((book) => book.authorID === parent.id),
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
