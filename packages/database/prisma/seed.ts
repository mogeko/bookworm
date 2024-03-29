import { createHash } from "node:crypto";
import { faker } from "@faker-js/faker/locale/en";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
faker.seed(114514); // To make sure we get the same data every time

async function seedAuthor() {
  return await Promise.all(
    randomArrayWith(50, async () => {
      return await prisma.author.upsert({
        where: { id: faker.number.int({ min: 1, max: 50 }) },
        update: {},
        create: {
          name: faker.person.fullName(),
          avatar: faker.image.urlLoremFlickr({ category: "people" }),
        },
      });
    })
  );
}

type Authors = Awaited<ReturnType<typeof seedAuthor>>;

async function seedUsers() {
  const orginUsers = await Promise.all(
    randomArrayWith(100, async () => {
      const email = faker.internet.email();
      return await prisma.user.upsert({
        where: { email: email },
        update: {},
        create: {
          email: email,
          name: faker.internet.userName(),
          avatar: faker.image.avatar(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
          authentication: {
            create: {
              password: createHash("sha512").update("pa$$w0rd").digest("hex"),
            },
          },
          profile: {
            create: {
              bio: faker.person.bio(),
              location: faker.location.city(),
              birthday: faker.date.past(),
              urls: randomArrayWith(3, () => faker.internet.url()),
            },
          },
        },
      });
    })
  );

  const userWithFollows = await Promise.all(
    orginUsers.map(async (user) => {
      return await prisma.user.update({
        where: { id: user.id },
        data: {
          followedBy: {
            connect: arrayElements(orginUsers, { min: 0, max: 20 }).filter(
              (otherUser) => otherUser.id !== user.id
            ),
          },
        },
      });
    })
  );

  return await Promise.all(
    userWithFollows.map(async (user) => {
      return await prisma.user.update({
        where: { id: user.id },
        data: {
          following: {
            connect: arrayElements(orginUsers, { min: 0, max: 20 }).filter(
              (otherUser) => otherUser.id !== user.id
            ),
          },
        },
      });
    })
  );
}

type Users = Awaited<ReturnType<typeof seedUsers>>;

async function seedPublishers() {
  return await Promise.all(
    randomArrayWith(50, async () => {
      return await prisma.publisher.upsert({
        where: { id: faker.number.int({ min: 1, max: 5 }) },
        update: {},
        create: {
          name: faker.company.name(),
        },
      });
    })
  );
}

type Publishers = Awaited<ReturnType<typeof seedPublishers>>;

async function seedSeries({ publiashers }: SeriesProps) {
  return await Promise.all(
    randomArrayWith(50, async () => {
      return await prisma.series.upsert({
        where: { id: faker.number.int({ min: 1, max: 20 }) },
        update: {},
        create: {
          name: faker.commerce.productName(),
          cover: faker.image.urlLoremFlickr({
            category: "logo",
            width: 1114,
            height: 1280,
          }),
          publisher: {
            connect: faker.helpers.arrayElement(publiashers),
          },
        },
      });
    })
  );
}

type Series = Awaited<ReturnType<typeof seedSeries>>;
type SeriesProps = { publiashers: Publishers };

async function seedBooks(props: BooksProps) {
  return await Promise.all(
    randomArrayWith(500, async () => {
      const isbn = faker.phone.number("978-#-##-######-#");
      const publish = faker.helpers.arrayElement(props.publishers);
      const _series = props.series.filter((s) => s.publisherId === publish.id);

      return await prisma.book.upsert({
        where: { isbn: isbn },
        update: {},
        create: {
          title: faker.lorem.sentence(5),
          description: faker.lorem.paragraph({ min: 5, max: 10 }),
          cover: faker.image.urlLoremFlickr({
            category: "book",
            width: 1114,
            height: 1280,
          }),
          isbn: isbn,
          createdAt: faker.date.past(),
          updatedAt: faker.date.recent(),
          authors: {
            connect: arrayElements(props.authors, { min: 1, max: 5 }),
          },
          translators: {
            connect: arrayElements(props.authors, { min: 0, max: 2 }),
          },
          tags: {
            connect: arrayElements(props.tags, { min: 0, max: 20 }),
          },
          owners: {
            connect: arrayElements(props.users),
          },
          publisher: {
            connect: publish,
          },
          series: {
            connect:
              _series.length !== 0
                ? faker.helpers.arrayElement(_series)
                : void 0,
          },
        },
      });
    })
  );
}

type Books = Awaited<ReturnType<typeof seedBooks>>;
type BooksProps = {
  users: Users;
  publishers: Publishers;
  authors: Authors;
  series: Series;
  tags: Tags;
};

async function seedBooklists({ users, books }: BooklistsProps) {
  return await Promise.all(
    randomArrayWith(300, async () => {
      return await prisma.booklist.upsert({
        where: { id: faker.number.int({ min: 1, max: 300 }) },
        update: {},
        create: {
          title: faker.lorem.sentence(3),
          description: faker.lorem.paragraph({ min: 5, max: 10 }),
          user: { connect: faker.helpers.arrayElement(users) },
          books: {
            connect: arrayElements(books, { min: 1, max: 30 }).map((book) => {
              return {
                id: book.id,
              };
            }),
          },
          status: faker.helpers.arrayElement(["TODO", "IN_PROGRESS", "DONE"]),
          priority: faker.helpers.arrayElement(["LOW", "MEDIUM", "HIGH"]),
        },
      });
    })
  );
}

type BooklistsProps = { users: Users; books: Books };

async function seedCommends(commentators: Users, targets: TargetsProps) {
  return await Promise.all(
    randomArrayWith(1000, async () => {
      const commentator = faker.helpers.arrayElement(commentators);

      const handleTargets = (targets: TargetsProps): any => {
        const key = faker.helpers.arrayElement(
          Object.keys(targets)
        ) as keyof TargetsProps;
        const target = faker.helpers.arrayElement(targets[key] as any);

        if (key === "books") {
          return {
            score: {
              create: {
                rate: faker.number.int({ min: 1, max: 10 }),
                book: { connect: target },
              },
            },
          };
        } else if (key === "series") {
          return {
            series: { connect: target },
          };
        } else {
          return {
            [key.slice(0, -1)]: { connect: target },
          };
        }
      };

      return await prisma.comment.upsert({
        where: { id: faker.number.int({ min: 1, max: 1000 }) },
        update: {},
        create: {
          content: faker.lorem.paragraph({ min: 5, max: 10 }),
          commentator: {
            connect: commentator,
          },
          votes: {
            create: arrayElements(commentators, { min: 0, max: 20 }).map(
              (commentator) => {
                return {
                  voter: { connect: commentator },
                  vote: faker.helpers.arrayElement(["LIKE", "DISLIKE"]),
                };
              }
            ),
          },
          ...handleTargets(targets),
        },
      });
    })
  );
}

type TargetsProps = { books: Books } & Omit<BooksProps, "tags">;

async function seedTags() {
  const tags = [
    "arts",
    "fiction",
    "literature",
    "science",
    "history",
    "business",
    "health",
    "biography",
    "social sciences",
    "animals",
    "architecture",
    "art lnstruction",
    "art History",
    "dance",
    "design",
    "fashion",
    "film",
    "graphic design",
    "music",
    "music theory",
    "painting",
    "photography",
    "bears",
    "cats",
    "kittens",
    "dogs",
    "puppies",
    "fantasy",
    "historical fiction",
    "horror",
    "humor",
    "literature",
    "magic",
    "mystery and detective stories",
    "plays",
    "poetry",
    "romance",
    "science fiction",
    "short stories",
    "thriller",
    "young adult",
    "biology",
    "chemistry",
    "mathematics",
    "physics",
    "programming",
    "management",
    "entrepreneurship",
    "business economics",
    "business success",
    "finance",
    "ancient civilization",
    "archaeology",
    "anthropology",
    "world war ii",
    "social life and customs",
  ];

  return await Promise.all(
    tags.map(async (tag) => {
      return await prisma.tag.upsert({
        where: { name: tag },
        update: {},
        create: { name: tag },
      });
    })
  );
}

type Tags = Awaited<ReturnType<typeof seedTags>>;

async function seedReferral(users: Users, books: Books) {
  return users.map(async (user) => {
    return await prisma.referral.upsert({
      where: { id: user.id },
      update: {
        books: {
          connect: arrayElements(books, 10).map((book) => {
            return {
              id: book.id,
            };
          }),
        },
      },
      create: {
        user: { connect: { id: user.id } },
        books: {
          connect: arrayElements(books, 10).map((book) => {
            return {
              id: book.id,
            };
          }),
        },
      },
    });
  });
}

/** Helper function to generate an array of random values */
function randomArrayWith<T>(length: number, fn: () => T) {
  return Array.from({ length: faker.number.int(length) }).map(fn);
}

/** Helper function to generate an array of random values */
const arrayElements = faker.helpers.arrayElements;

// Run the seed function
(async () => {
  try {
    const results = {
      authors: await seedAuthor(),
      users: await seedUsers(),
      publishers: await seedPublishers(),
    };

    const tags = await seedTags();
    const series = await seedSeries({ publiashers: results.publishers });
    const books = await seedBooks({ ...results, series, tags });
    await seedBooklists({ users: results.users, books });
    await seedReferral(results.users, books);
    await seedCommends(results.users, { ...results, books, series });
  } catch (err) {
    console.error(err), process.exit(1);
  } finally {
    await prisma.$disconnect();
    faker.seed();
  }
})();
