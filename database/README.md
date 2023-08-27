# Database Setup

Ensure that you have a MySQL database server installed and running on your local machine. You can download and install MySQL Community Edition from the official [MySQL](https://dev.mysql.com/downloads/) website.

## Script Execution

To set up the database for your project, follow these steps:

1. Open your terminal or command prompt.
2. Navigate to the directory containing the `script.sql` file.
3. Use the following command to run the script and create the necessary tables:

```bash
    mysql -u <username> -p <database_name> < script.sql
```

Replace `<username>` with your MySQL username and `<database_name>` with the name of your database. Enter your MySQL password when prompted.

## Data Population

To populate your MySQL database with initial data, proceed as follows:

1. Open your terminal or command prompt.
2. Navigate to the directory containing the `data.sql` file.
3. Use the following command to run the script and insert data into the respective tables:

```bash
    mysql -u <username> -p <database_name> < data.sql
```

Replace `<username>` with your MySQL username and `<database_name>` with the name of your database. Enter your MySQL password when prompted.

## Conceptual Model

In the same folder, you will find an image named conceptual_model.png. This image illustrates the conceptual model of the application's database. The model provides a visual overview of the database structure. Feel free to refer to this image to gain a better understanding of the database design.

## Access Control

For security purposes, a special account has been created specifically for this project. This account has limited access to only the necessary table used within this project. This approach enhances security by minimizing potential vulnerabilities and access to sensitive data.

By following these steps, you can successfully set up the database for your project, populate it with initial data, and ensure proper access controls for enhanced security.
