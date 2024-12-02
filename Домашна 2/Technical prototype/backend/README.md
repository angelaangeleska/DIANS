## Configuration

In order to connect the application to a PostgreSQL database, you need to configure the `application.properties` file with your database credentials.

1. Open the `application.properties` file:
   - You can find this file in the `src/main/resources` directory of your project.

2. Set the Database Credentials:
   - Replace the placeholders with your PostgreSQL database username and password.
     ```java 
     spring.datasource.username=your_database_username
     spring.datasource.password=your_database_password
     ```

3. Other Configuration:
   - This project is configured to use PostgreSQL as the database dialect. If you're using a different database, make sure to update the `spring.jpa.properties.hibernate.dialect` accordingly.

4. Database Setup:
   - Ensure that your PostgreSQL server is running and that you have created a database for this project.
   - The application will automatically handle table creation based on the entity classes due to the `spring.jpa.hibernate.ddl-auto=create` property.