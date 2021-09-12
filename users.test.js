const { createPool } = require("mysql2/promise");
const faker = require("faker");

describe("Database Tests", () => {
    let connection;

    beforeEach(async () => {
        let createTableSQL =
            "CREATE TABLE `users` ( `id` INT(2) NOT NULL AUTO_INCREMENT , `name` VARCHAR(100) NOT NULL , `email` VARCHAR(50) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;";

        connection = await createPool({
            host: "mysql-50005-0.cloudclusters.net",
            user: "admin",
            password: "OZAc2YHH",
            port: 12419,
            database: "circleci"
        });
        console.log("Connected to database");

        await connection.query(createTableSQL);
    });

    it("Test CREATE and READ", async () => {
        try {
            const total_test_users = 3;
            let insertQueries = [];

            for (let i = 0; i < total_test_users; i++) {
                let insertSQL = `INSERT INTO users (id, name, email) VALUES (NULL, '${faker.name.findName()}', '${faker.internet.email()}');`;

                insertQueries.push(connection.query(insertSQL));
            }

            await Promise.all(insertQueries);

            const [rows, fields] = await connection.query("SELECT * FROM users");

            expect(rows.length).toBe(total_test_users);
        } catch (error) {
            console.log(error);
            let dropTableSQL = "DROP TABLE IF EXISTS `users`";
            await connection.query(dropTableSQL);
            await connection.end();
        }
    }, 60000);

    afterEach(async () => {
        let dropTableSQL = "DROP TABLE IF EXISTS `users`";
        await connection.query(dropTableSQL);
        await connection.end();
    });
});
