INSERT INTO department (name)
VALUES ("Engineering"), ("Human Resources"), ("Finance"), ("Management"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES  ("Senior Engineer","100000", 1),
        ("Junior Engineer","50000", 1),
        ("Senior HR","100000", 2),
        ("Junior HR","40000", 2),
        ("Senior Finance","200000", 3),
        ("Junior Finance","80000", 3),
        ("Senior Manager","200000", 4),
        ("Junior Manager","80000", 4),
        ("Senior Salesperson","100000", 5),
        ("Junior Salesperson","80000", 5)
;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Petra", "Punch", 1, null),
        ("David", "Pinch", 2, 1),
        ("Pep", "Prone", 3, null),
        ("Peter", "Prick", 4, 3),
        ("Mike", "Mulch", 5, null),
        ("Barbara", "Peat", 6, 5),
        ("Charles", "Broke", 7, null),
        ("Melanie", "Wall", 8, 7),
        ("Kelly", "Brick", 9, null),
        ("Anthony", "Krone", 10, 9)
;

