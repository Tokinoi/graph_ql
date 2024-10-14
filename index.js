import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const typeDefs = `#graphql
type Book {
    id : Int!
    title: String!
    author: Author!
    category: Category!
}

type Category {
    id: Int!
    name: String!
    books: [Book!]!
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
    bookById(id:Int!): Book
    authorById(id:Int!): Author
    categoryById(id:Int!): Category
}

input CreateBookInput {
    title : String!
    authorId: Int!
    categoryId : Int!
}

type Mutation{
    createBook(input: CreateBookInput): Book!
}


`;

const books = [
    {
        id:1,
        title: 'The Awakening',
        authorID: 1,
        categoryId: 2
    },
    {
        id:2,
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
        books: () => prisma.book.findMany(),
        bookById:(_,{ id })=> prisma.book.findUnique({where : { id }}),
        authorById:(_,{ id })=> prisma.author.findUnique({where:{id}}),
        categoryById:(_,{ id })=> prisma.category.findUnique({where:{id}}),
        authors: () => prisma.author.findMany(),
        categories: () => prisma.category.findMany(),

    },

    Book: {
        author: ({authorID}) => prisma.author.findUnique({where : { id:authorID }}),
        category: ({categoryID}) => prisma.category.findUnique({where:{ id:categoryID }}),
    },

    Author: {
        books: ({authorID}) => prisma.book.findMany({where : { id:authorID }}),
    },
    Category: {
        books: ({categoryID}) => prisma.book.findMany({where : { id:categoryID }}),
    },
    Mutation: {
        createBook: async (_, { input }) => {
            const newBook = await prisma.book.create({
                data: {
                    title: input.title,
                    authorID: input.authorId,  // ID de l'auteur
                    categoryID: input.categoryId,  // ID de la catégorie
                },
            });
            return newBook;
        }
    }



};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
