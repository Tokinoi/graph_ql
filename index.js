import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {PrismaClient} from "@prisma/client";
import DataLoader from 'DataLoader';


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

const authorById = new DataLoader(async (ids) => {
    const authors = await prisma.author.findMany({
        where : {id: { in: ids }}
    })
    return ids.map((id)=> authors.find((author) => author.id ===id));
});

const bookById = new DataLoader(async (ids) => {
    const books = await prisma.book.findMany({
        where : {id: { in: ids }}
    })
    return ids.map((id)=> books.find((book) => book.id ===id));
});

const categoryById = new DataLoader(async (ids) => {
    const categories = await prisma.category.findMany({
        where : {id: { in: ids }}
    })
    return ids.map((id)=> categories.find((category) => category.id ===id));
});

const booksByAuthorId = new DataLoader(async (ids) => {
    const books = await prisma.book.findMany({
        where : {id: { in: ids }}
    })
    return ids.map((id)=> books.filter((book) => book.authorID ===id));
});

const booksByCategoryId = new DataLoader(async (ids) => {
    const books = await prisma.book.findMany({
        where : {id: { in: ids }}
    })
    return ids.map((id)=> books.filter((book) => book.categoryID ===id));
});


const resolvers = {
    Query: {
        books: () => prisma.book.findMany(),
        bookById:(_,{ id })=> bookById.load(id),
        authorById:(_,{ id })=> authorById.load(id),
        categoryById:(_,{ id })=> categoryById.load(id),
        authors: () => prisma.author.findMany(),
        categories: () => prisma.category.findMany(),

    },

    Book: {
        author: (parent) => authorById.load(parent.authorID),
        category: (parent) => categoryById.load(parent.categoryID),
    },

    Author: {
        books: (parent) => booksByAuthorId.load(parent.id),
    },
    Category: {
        books: (parent) => booksByCategoryId.load(parent.id),
    },
    Mutation: {
        createBook: async (_, { input }) => {
            return prisma.book.create({
                data: {
                    title: input.title,
                    authorID: input.authorId,  // ID de l'auteur
                    categoryID: input.categoryId,  // ID de la catégorie
                },
            });

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
