
DROP TABLE IF EXISTS [dbo].[CONSUMABLES]
DROP TABLE IF EXISTS [dbo].[CONSUMABLE_TYPES]

DROP TABLE IF EXISTS [dbo].[ICMAL_STATUS_RECORDS]
DROP TABLE IF EXISTS [dbo].[ICMAL_STATUSES]
DROP TABLE IF EXISTS [dbo].[ICMAL]
DROP TABLE IF EXISTS [dbo].[ICMAL_DELIVERY_TYPES]
DROP TABLE IF EXISTS [dbo].[ICMAL_SOURCE_TYPES]
DROP TABLE IF EXISTS [dbo].[BATCH]

DROP TABLE IF EXISTS [dbo].[SHIFT_REPORT_USER_RECORDS]
DROP TABLE IF EXISTS [dbo].[SHIFT_REPORT_PRINTER_RECORDS]
DROP TABLE IF EXISTS [dbo].[SHIFT_REPORTS]
DROP TABLE IF EXISTS [dbo].[SHIFTS]
DROP TABLE IF EXISTS [dbo].[PRINTERS]

DROP TABLE IF EXISTS [dbo].[PRODUCT_STOCK_RECORDS]
DROP TABLE IF EXISTS [dbo].[PRODUCT_STOCK_RECORD_TYPES]
DROP TABLE IF EXISTS [dbo].[PRODUCTS]
DROP TABLE IF EXISTS [dbo].[PRODUCT_GROUPS]
DROP TABLE IF EXISTS [dbo].[PRODUCT_TYPES]

DROP TABLE IF EXISTS [dbo].[BANKS]
    DROP INDEX IF EXISTS [dbo].[BANKS].[BANKS_NAME_UNIQUE]

DROP TABLE IF EXISTS [dbo].[USERS]
DROP TABLE IF EXISTS [dbo].[USER_ROLES]


CREATE TABLE [dbo].[USER_ROLES](
	[ID] INT PRIMARY KEY,
	[NAME] NVARCHAR (50) NOT NULL,
)

CREATE TABLE [dbo].[USERS](
	[SICIL] NVARCHAR (50) PRIMARY KEY,
    [USER_ROLE_ID] INT NOT NULL,
        CONSTRAINT FK_USERS_USER_ROLES FOREIGN KEY ([USER_ROLE_ID]) 
        REFERENCES [dbo].[USER_ROLES]([ID]) ,
    -- ...ACTIVE DIRECTORY'DEN GELECEK ALANLAR
	[CREATED_AT] DATETIME NOT NULL,
	[UPDATED_AT] DATETIME NULL,
)

CREATE TABLE [dbo].[BANKS](
    [ID] INT IDENTITY(1, 1) PRIMARY KEY,
    [NAME] NVARCHAR(255) NOT NULL,
    [IS_ACTIVE] BIT NOT NULL,
    [IS_DELETED] BIT NOT NULL,
	[CREATED_AT] DATETIME NOT NULL,
	[EDITED_AT] DATETIME NULL,
    [CREATED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_BANKS_CREATED_BY_USERS FOREIGN KEY ([CREATED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
    [EDITED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_BANKS_EDITED_BY_USERS FOREIGN KEY ([EDITED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
);
 
CREATE UNIQUE INDEX BANKS_NAME_UNIQUE ON
    [dbo].[BANKS] ([NAME]);
GO

CREATE TABLE [dbo].[PRODUCT_TYPES](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
	[NAME] NVARCHAR (50) NOT NULL,
    [IS_ACTIVE] BIT NOT NULL,
    [IS_DELETED] BIT NOT NULL,
	[CREATED_AT] DATETIME NOT NULL,
	[EDITED_AT] DATETIME NULL,
    [CREATED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCT_TYPES_CREATED_BY_USERS FOREIGN KEY ([CREATED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
    [EDITED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCT_TYPES_EDITED_BY_USERS FOREIGN KEY ([EDITED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
)

CREATE TABLE [dbo].[PRODUCT_GROUPS](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
	[NAME] NVARCHAR (50) NOT NULL,
    [IS_ACTIVE] BIT NOT NULL,
    [IS_DELETED] BIT NOT NULL,
	[BANK_ID] INT NOT NULL,
        CONSTRAINT FK_PRODUCT_GROUPS_BANKS FOREIGN KEY ([BANK_ID]) 
        REFERENCES [dbo].[BANKS]([ID]) ,
	[CLIENT_ID] NVARCHAR(100) NULL,
	[CREATED_AT] DATETIME NOT NULL,
	[EDITED_AT] DATETIME NULL,
    [CREATED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCT_GROUPS_CREATED_BY_USERS FOREIGN KEY ([CREATED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
    [EDITED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCT_GROUPS_EDITED_BY_USERS FOREIGN KEY ([EDITED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
)

CREATE TABLE [dbo].[PRODUCTS](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
	[NAME] NVARCHAR (50) NOT NULL,
    [IS_ACTIVE] BIT NOT NULL,
    [IS_DELETED] BIT NOT NULL,
    [PRODUCT_TYPE_ID] INT NOT NULL,
        CONSTRAINT FK_PRODUCTS_PRODUCT_TYPES FOREIGN KEY ([PRODUCT_TYPE_ID]) 
        REFERENCES [dbo].[PRODUCT_TYPES]([ID]) ,
    [PRODUCT_GROUP_ID] INT NOT NULL,
        CONSTRAINT FK_PRODUCTS_PRODUCT_GROUPS FOREIGN KEY ([PRODUCT_GROUP_ID]) 
        REFERENCES [dbo].[PRODUCT_GROUPS]([ID]) ,
    [MAIN_SAFE_QUANTITY] INT NOT NULL,
    [DAILY_SAFE_QUANTITY] INT NOT NULL,
	[CREATED_AT] DATETIME NOT NULL,
	[EDITED_AT] DATETIME NULL,
    [CREATED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCTS_CREATED_BY_USERS FOREIGN KEY ([CREATED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
    [EDITED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCTS_EDITED_BY_USERS FOREIGN KEY ([EDITED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
)

CREATE TABLE [dbo].[PRODUCT_STOCK_RECORD_TYPES](
	[ID] INT PRIMARY KEY,
	[NAME] NVARCHAR (50) NOT NULL,
)

CREATE TABLE [dbo].[PRODUCT_STOCK_RECORDS](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
    [PRODUCT_ID] INT NOT NULL,
        CONSTRAINT FK_PRODUCT_STOCK_RECORDS_PRODUCTS FOREIGN KEY ([PRODUCT_ID]) 
        REFERENCES [dbo].[PRODUCT_TYPES]([ID]) ,
    [PRODUCT_STOCK_RECORD_TYPE_ID] INT NOT NULL,
        CONSTRAINT FK_PRODUCT_STOCK_RECORDS_PRODUCT_STOCK_RECORD_TYPES FOREIGN KEY ([PRODUCT_STOCK_RECORD_TYPE_ID]) 
        REFERENCES [dbo].[PRODUCT_STOCK_RECORD_TYPES]([ID]) ,
    [IS_MAIN_SAFE] BIT NOT NULL,
	[CREATED_AT] DATETIME NOT NULL,
    [CREATED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCT_STOCK_RECORDS_CREATED_BY_USERS FOREIGN KEY ([CREATED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL])
)

CREATE TABLE [dbo].[CONSUMABLE_TYPES](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
	[NAME] NVARCHAR (50) NOT NULL,
    [IS_ACTIVE] BIT NOT NULL,
    [IS_DELETED] BIT NOT NULL,
	[CREATED_AT] DATETIME NOT NULL,
	[EDITED_AT] DATETIME NULL,
    [CREATED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_CONSUMABLE_TYPES_CREATED_BY_USERS FOREIGN KEY ([CREATED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
    [EDITED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_CONSUMABLE_TYPES_EDITED_BY_USERS FOREIGN KEY ([EDITED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
)

CREATE TABLE [dbo].[CONSUMABLES](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
	[NAME] NVARCHAR (50) NOT NULL,
    [IS_ACTIVE] BIT NOT NULL,
    [IS_DELETED] BIT NOT NULL,
    [CONSUMABLE_TYPE_ID] INT NOT NULL,
        CONSTRAINT FK_CONSUMABLES_CONSUMABLE_TYPES FOREIGN KEY ([CONSUMABLE_TYPE_ID]) 
        REFERENCES [dbo].[CONSUMABLE_TYPES]([ID]) ,
    [MULTIPLIER] FLOAT NOT NULL,
	[CREATED_AT] DATETIME NOT NULL,
	[EDITED_AT] DATETIME NULL,
    [CREATED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_CONSUMABLES_CREATED_BY_USERS FOREIGN KEY ([CREATED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
    [EDITED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_CONSUMABLES_EDITED_BY_USERS FOREIGN KEY ([EDITED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
)


CREATE TABLE [dbo].[ICMAL_DELIVERY_TYPES](
	[ID] INT PRIMARY KEY,
	[NAME] NVARCHAR (50) NOT NULL,
)

CREATE TABLE [dbo].[ICMAL_SOURCE_TYPES](
	[ID] INT PRIMARY KEY,
	[NAME] NVARCHAR (50) NOT NULL,
)

CREATE TABLE [dbo].[BATCH](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
	[BANK_ID] INT NOT NULL,
        CONSTRAINT FK_BATCH_BANKS FOREIGN KEY ([BANK_ID]) 
        REFERENCES [dbo].[BANKS]([ID]) ,
	[DESCRIPTION] NVARCHAR (500) NULL,
	[CLIENT_DESCRIPTION] NVARCHAR (500) NULL,
	[CREATED_AT] DATETIME NOT NULL,
    [CREATED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_BATCH_CREATED_BY_USERS FOREIGN KEY ([CREATED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
)

CREATE TABLE [dbo].[ICMAL](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
	[DESCRIPTION] NVARCHAR (500) NULL,
	[CLIENT_DESCRIPTION] NVARCHAR (500) NULL,
    [BATCH_ID] INT NOT NULL,
        CONSTRAINT FK_ICMAL_BATCH FOREIGN KEY ([BATCH_ID]) 
        REFERENCES [dbo].[BATCH]([ID]) ,
    [PRODUCT_ID] INT NOT NULL,
        CONSTRAINT FK_ICMAL_PRODUCTS FOREIGN KEY ([PRODUCT_ID]) 
        REFERENCES [dbo].[PRODUCTS]([ID]) ,
    [ICMAL_DELIVERY_TYPE_ID] INT NOT NULL,
        CONSTRAINT FK_ICMAL_ICMAL_DELIVERY_TYPES FOREIGN KEY ([ICMAL_DELIVERY_TYPE_ID]) 
        REFERENCES [dbo].[ICMAL_DELIVERY_TYPES]([ID]) ,
    [ICMAL_SOURCE_TYPE_ID] INT NOT NULL,
        CONSTRAINT FK_ICMAL_ICMAL_SOURCE_TYPES FOREIGN KEY ([ICMAL_SOURCE_TYPE_ID]) 
        REFERENCES [dbo].[ICMAL_SOURCE_TYPES]([ID]) ,
    [QUANTITY] INT NOT NULL,
	[CREATED_AT] DATETIME NOT NULL,
	[EDITED_AT] DATETIME NULL,
    [CREATED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_ICMAL_CREATED_BY_USERS FOREIGN KEY ([CREATED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
    [EDITED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_ICMAL_EDITED_BY_USERS FOREIGN KEY ([EDITED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
)

CREATE TABLE [dbo].[ICMAL_STATUSES](
	[ID] INT PRIMARY KEY,
	[NAME] NVARCHAR (50) NOT NULL,
)

CREATE TABLE [dbo].[ICMAL_STATUS_RECORDS](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
    [ICMAL_ID] INT NOT NULL,
        CONSTRAINT FK_ICMAL_STATUS_RECORDS_ICMAL FOREIGN KEY ([ICMAL_ID]) 
        REFERENCES [dbo].[ICMAL]([ID]) ,
    [ICMAL_STATUS_ID] INT NOT NULL,
        CONSTRAINT FK_ICMAL_STATUS_RECORDS_ICMAL_STATUSES FOREIGN KEY ([ICMAL_STATUS_ID]) 
        REFERENCES [dbo].[ICMAL_STATUSES]([ID]) ,
	[CREATED_AT] DATETIME NOT NULL,
)

CREATE TABLE [dbo].[SHIFTS](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
	[DESCRIPTION] NVARCHAR (500) NOT NULL,
    [START_HOUR] SMALLINT NOT NULL,
    [END_HOUR] SMALLINT NOT NULL,
    [IS_ACTIVE] BIT NOT NULL,
    [IS_DELETED] BIT NOT NULL,
	[CREATED_AT] DATETIME NOT NULL,
	[EDITED_AT] DATETIME NULL,
    [CREATED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_SHIFTS_CREATED_BY_USERS FOREIGN KEY ([CREATED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
    [EDITED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_SHIFTS_EDITED_BY_USERS FOREIGN KEY ([EDITED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
)

CREATE TABLE [dbo].[PRINTERS](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
	[NAME] NVARCHAR (50) NOT NULL,
	[DESCRIPTION] NVARCHAR (500) NOT NULL,
	[MODEL] NVARCHAR (50) NOT NULL,
	[SERIAL_NO] NVARCHAR (50) NOT NULL,
    [IS_ACTIVE] BIT NOT NULL,
    [IS_DELETED] BIT NOT NULL,
	[CREATED_AT] DATETIME NOT NULL,
	[EDITED_AT] DATETIME NULL,
    [CREATED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRINTERS_CREATED_BY_USERS FOREIGN KEY ([CREATED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
    [EDITED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRINTERS_EDITED_BY_USERS FOREIGN KEY ([EDITED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
)

CREATE TABLE [dbo].[SHIFT_REPORTS](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
	[REPORT_DATE] DATE NOT NULL,
    [SHIFT_ID] INT NOT NULL,
        CONSTRAINT FK_SHIFT_REPORTS_SHIFTS FOREIGN KEY ([SHIFT_ID]) 
        REFERENCES [dbo].[SHIFTS]([ID]) ,
	[DESCRIPTION] NVARCHAR (500) NOT NULL,
    [IS_DELETED] BIT NOT NULL,
	[CREATED_AT] DATETIME NOT NULL,
	[EDITED_AT] DATETIME NULL,
    [CREATED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_SHIFT_REPORTS_CREATED_BY_USERS FOREIGN KEY ([CREATED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
    [EDITED_BY] NVARCHAR(50) NULL,
        CONSTRAINT FK_SHIFT_REPORTS_EDITED_BY_USERS FOREIGN KEY ([EDITED_BY]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
)

CREATE TABLE [dbo].[SHIFT_REPORT_PRINTER_RECORDS](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
	[SHIFT_REPORT_ID] INT NOT NULL,
        CONSTRAINT FK_SHIFT_REPORT_PRINTER_RECORDS_SHIFT_REPORTS FOREIGN KEY ([SHIFT_REPORT_ID]) 
        REFERENCES [dbo].[SHIFT_REPORTS]([ID]) ,
	[PRINTER_ID] INT NOT NULL,
        CONSTRAINT FK_SHIFT_REPORT_PRINTER_RECORDS_PRINTERS FOREIGN KEY ([PRINTER_ID]) 
        REFERENCES [dbo].[PRINTERS]([ID]) ,
	[COUNTER_START] INT NOT NULL,
	[COUNTER_END] INT NOT NULL,
	[DESCRIPTION] NVARCHAR (500) NOT NULL,
)

CREATE TABLE [dbo].[SHIFT_REPORT_USER_RECORDS](
	[ID] INT IDENTITY(1, 1) PRIMARY KEY,
	[SHIFT_REPORT_ID] INT NOT NULL,
        CONSTRAINT FK_SHIFT_REPORT_USER_RECORDS_SHIFT_REPORTS FOREIGN KEY ([SHIFT_REPORT_ID]) 
        REFERENCES [dbo].[SHIFT_REPORTS]([ID]) ,
	[USER_SICIL] NVARCHAR (50) NOT NULL,
        CONSTRAINT FK_SHIFT_REPORT_USER_RECORDS_USERS FOREIGN KEY ([USER_SICIL]) 
        REFERENCES [dbo].[USERS]([SICIL]) ,
	[DESCRIPTION] NVARCHAR (500) NOT NULL,
)