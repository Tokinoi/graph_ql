// seed.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Créer des catégories
    const categories = await prisma.category.createMany({
        data: [
            { name: 'Horreur' },
            { name: 'Romance' },
            { name: 'Science-fiction' },
            { name: 'Fantasy' },
            { name: 'Thriller' },
            { name: 'Non-Fiction' },
            { name: 'Mystery' },
        ],
    });

    // Créer des auteurs
    const authors = await prisma.author.createMany({
        data: [
            { name: 'Jean' },
            { name: 'Seb' },
            { name: 'Alice' },
            { name: 'Bob' },
            { name: 'Clara' },
            { name: 'David' },
            { name: 'Eva' },
            { name: 'Frank' },
        ],
    });

    // Créer des livres
    const books = await prisma.book.createMany({
        data: [
            {
                title: 'The Awakening',
                authorID: 1, // Jean
                categoryID: 1, // Horreur
            },
            {
                title: 'City of Glass',
                authorID: 2, // Seb
                categoryID: 2, // Romance
            },
            {
                title: 'Dune',
                authorID: 3, // Alice
                categoryID: 3, // Science-fiction
            },
            {
                title: 'Harry Potter and the Philosopher\'s Stone',
                authorID: 4, // Bob
                categoryID: 4, // Fantasy
            },
            {
                title: 'The Da Vinci Code',
                authorID: 5, // Clara
                categoryID: 5, // Thriller
            },
            {
                title: 'Sapiens: A Brief History of Humankind',
                authorID: 6, // David
                categoryID: 6, // Non-Fiction
            },
            {
                title: 'Gone Girl',
                authorID: 7, // Eva
                categoryID: 7, // Mystery
            },
            {
                title: 'The Catcher in the Rye',
                authorID: 8, // Frank
                categoryID: 1, // Horreur
            },
            {
                title: 'Pride and Prejudice',
                authorID: 2, // Seb
                categoryID: 2, // Romance
            },
            {
                title: 'The Martian',
                authorID: 3, // Alice
                categoryID: 3, // Science-fiction
            },
            {
                title: 'The Hobbit',
                authorID: 4, // Bob
                categoryID: 4, // Fantasy
            },
        ],
    });

    console.log({ categories, authors, books });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
