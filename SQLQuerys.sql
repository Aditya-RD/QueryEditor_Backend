CREATE TABLE Workbooks (
    WorkbookID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    ProfileID INT,
    Timestamp DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE Worksheets (
    WorksheetID INT PRIMARY KEY IDENTITY(1,1),
    WorkbookID INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    EditorText NVARCHAR(MAX),
    DesignConfig NVARCHAR(MAX),
    Timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (WorkbookID) REFERENCES Workbooks(WorkbookID)
);

CREATE TABLE SavedQueries (
    SavedQueryID INT PRIMARY KEY IDENTITY(1,1),
    WorksheetID INT NOT NULL,
    QueryText NVARCHAR(MAX) NOT NULL,
    Timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (WorksheetID) REFERENCES Worksheets(WorksheetID)
);

CREATE TABLE ExecutedQueries (
    ExecutedQueryID INT PRIMARY KEY IDENTITY(1,1),
    WorksheetID INT NOT NULL,
    QueryText NVARCHAR(MAX) NOT NULL,
    ExecutionResult NVARCHAR(MAX),
    Timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (WorksheetID) REFERENCES Worksheets(WorksheetID)
);

-- Insert sample workbooks
INSERT INTO Workbooks (Name, Description, ProfileID)
VALUES 
    ('Finance Workbook', 'Contains financial data', 101),
    ('HR Workbook', 'Contains HR related data', 102);

-- Insert sample worksheets
INSERT INTO Worksheets (WorkbookID, Name, EditorText, DesignConfig)
VALUES 
    (1, 'Sheet1', 'SELECT * FROM Employees', '{ "layout": "grid" }'),
    (1, 'Sheet2', 'SELECT * FROM Departments', '{ "layout": "chart" }'),
    (2, 'Summary', 'SELECT COUNT(*) FROM Sales', '{ "layout": "summary" }');

-- Insert sample saved queries
INSERT INTO SavedQueries (WorksheetID, QueryText)
VALUES 
    (1, 'SELECT * FROM Employees'),
    (2, 'SELECT * FROM Departments'),
    (3, 'SELECT * FROM Sales');

-- Insert sample executed queries
INSERT INTO ExecutedQueries (WorksheetID, QueryText, ExecutionResult)
VALUES 
    (1, 'SELECT * FROM Employees', '100 rows selected'),
    (2, 'SELECT * FROM Departments', '50 rows selected'),
    (3, 'SELECT COUNT(*) FROM Sales', '5000 records');


ALTER TABLE Worksheets
ADD CONSTRAINT FK_WorkbookID
FOREIGN KEY (WorkbookID) REFERENCES Workbooks(WorkbookID)
ON DELETE CASCADE;

-- Modify SavedQueries table to cascade delete on WorksheetID
ALTER TABLE SavedQueries
ADD CONSTRAINT FK_WorksheetID_Saved
FOREIGN KEY (WorksheetID) REFERENCES Worksheets(WorksheetID)
ON DELETE CASCADE;

-- Modify ExecutedQueries table to cascade delete on WorksheetID
ALTER TABLE ExecutedQueries
ADD CONSTRAINT FK_WorksheetID_Executed
FOREIGN KEY (WorksheetID) REFERENCES Worksheets(WorksheetID)
ON DELETE CASCADE;