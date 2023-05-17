
DROP TABLE IF EXISTS [dbo].[CONSUMABLE_PRODUCT_RECORDS]
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
    DROP INDEX IF EXISTS [dbo].[PRINTERS].[PRINTERS_NAME_UNIQUE]
    DROP INDEX IF EXISTS [dbo].[PRINTERS].[PRINTERS_SERIAL_UNIQUE]

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
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR (50) NOT NULL,
)

CREATE TABLE [dbo].[USERS](
	[sicil] NVARCHAR (50) PRIMARY KEY,
    [name] NVARCHAR (200) NOT NULL,
	[user_role_id] INT NOT NULL,
        CONSTRAINT FK_USERS_USER_ROLES FOREIGN KEY ([user_role_id]) 
        REFERENCES [dbo].[USER_ROLES]([id]) ,
    -- ...ACTIVE DIRECTORY'DEN GELECEK ALANLAR
)

CREATE TABLE [dbo].[BANKS](
    [id] INT IDENTITY(1, 1) PRIMARY KEY,
    [name] NVARCHAR(255) NOT NULL,
    [is_active] BIT NOT NULL DEFAULT 1,
    [is_deleted] BIT NOT NULL DEFAULT 0,
	[created_at] DATETIME NOT NULL,
	[edited_at] DATETIME NULL,
    [created_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_BANKS_CREATED_BY_USERS FOREIGN KEY ([created_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
    [edited_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_BANKS_EDITED_BY_USERS FOREIGN KEY ([edited_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
);
 
CREATE UNIQUE INDEX BANKS_NAME_UNIQUE ON
    [dbo].[BANKS] ([name]);
GO

CREATE TABLE [dbo].[PRODUCT_TYPES](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR (50) NOT NULL,
    [is_active] BIT NOT NULL DEFAULT 1,
    [is_deleted] BIT NOT NULL DEFAULT 0,
	[created_at] DATETIME NOT NULL,
	[edited_at] DATETIME NULL,
    [created_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCT_TYPES_CREATED_BY_USERS FOREIGN KEY ([created_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
    [edited_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCT_TYPES_EDITED_BY_USERS FOREIGN KEY ([edited_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
)

CREATE TABLE [dbo].[PRODUCT_GROUPS](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR (50) NOT NULL,
    [is_active] BIT NOT NULL DEFAULT 1,
    [is_deleted] BIT NOT NULL DEFAULT 0,
	[bank_id] INT NOT NULL,
        CONSTRAINT FK_PRODUCT_GROUPS_BANKS FOREIGN KEY ([bank_id]) 
        REFERENCES [dbo].[BANKS]([id]) ,
	[client_id] NVARCHAR(100) NULL,
	[description] NVARCHAR(500) NULL,
	[created_at] DATETIME NOT NULL,
	[edited_at] DATETIME NULL,
    [created_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCT_GROUPS_CREATED_BY_USERS FOREIGN KEY ([created_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
    [edited_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCT_GROUPS_EDITED_BY_USERS FOREIGN KEY ([edited_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
)

CREATE TABLE [dbo].[PRODUCTS](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR (50) NOT NULL,
    [is_active] BIT NOT NULL DEFAULT 1,
    [is_deleted] BIT NOT NULL DEFAULT 0,
    [product_type_id] INT NOT NULL,
        CONSTRAINT FK_PRODUCTS_PRODUCT_TYPES FOREIGN KEY ([product_type_id]) 
        REFERENCES [dbo].[PRODUCT_TYPES]([id]) ,
    [product_group_id] INT NOT NULL,
        CONSTRAINT FK_PRODUCTS_PRODUCT_GROUPS FOREIGN KEY ([product_group_id]) 
        REFERENCES [dbo].[PRODUCT_GROUPS]([id]) ,
	[client_id] NVARCHAR(100) NULL,
	[description] NVARCHAR(500) NULL,
    [main_safe_quantity] INT NOT NULL,
    [daily_safe_quantity] INT NOT NULL,
	[created_at] DATETIME NOT NULL,
	[edited_at] DATETIME NULL,
    [created_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCTS_CREATED_BY_USERS FOREIGN KEY ([created_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
    [edited_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCTS_EDITED_BY_USERS FOREIGN KEY ([edited_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
)

CREATE TABLE [dbo].[PRODUCT_STOCK_RECORD_TYPES](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR (50) NOT NULL,
)

CREATE TABLE [dbo].[PRODUCT_STOCK_RECORDS](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
    [product_id] INT NOT NULL,
        CONSTRAINT FK_PRODUCT_STOCK_RECORDS_PRODUCTS FOREIGN KEY ([product_id]) 
        REFERENCES [dbo].[PRODUCT_TYPES]([id]) ,
    [product_stock_record_type_id] INT NOT NULL,
        CONSTRAINT FK_PRODUCT_STOCK_RECORDS_PRODUCT_STOCK_RECORD_TYPES FOREIGN KEY ([product_stock_record_type_id]) 
        REFERENCES [dbo].[PRODUCT_STOCK_RECORD_TYPES]([id]) ,
    [is_main_safe] BIT NOT NULL,
	[created_at] DATETIME NOT NULL,
    [created_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRODUCT_STOCK_RECORDS_CREATED_BY_USERS FOREIGN KEY ([created_by]) 
        REFERENCES [dbo].[USERS]([sicil])
)

CREATE TABLE [dbo].[CONSUMABLE_TYPES](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR (50) NOT NULL,
    [is_active] BIT NOT NULL DEFAULT 1,
    [is_deleted] BIT NOT NULL DEFAULT 0,
	[created_at] DATETIME NOT NULL,
	[edited_at] DATETIME NULL,
    [created_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_CONSUMABLE_TYPES_CREATED_BY_USERS FOREIGN KEY ([created_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
    [edited_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_CONSUMABLE_TYPES_EDITED_BY_USERS FOREIGN KEY ([edited_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
)

CREATE TABLE [dbo].[CONSUMABLES](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR (50) NOT NULL,
    [is_active] BIT NOT NULL DEFAULT 1,
    [is_deleted] BIT NOT NULL DEFAULT 0,
    [consumable_type_id] INT NOT NULL,
        CONSTRAINT FK_CONSUMABLES_CONSUMABLE_TYPES FOREIGN KEY ([consumable_type_id]) 
        REFERENCES [dbo].[CONSUMABLE_TYPES]([id]) ,
    [multiplier] FLOAT NOT NULL,
	[created_at] DATETIME NOT NULL,
	[edited_at] DATETIME NULL,
    [created_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_CONSUMABLES_CREATED_BY_USERS FOREIGN KEY ([created_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
    [edited_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_CONSUMABLES_EDITED_BY_USERS FOREIGN KEY ([edited_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
)

CREATE TABLE [dbo].[CONSUMABLE_PRODUCT_RECORDS](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
    [consumable_id] INT NOT NULL,
        CONSTRAINT FK_CONSUMABLE_PRODUCT_RECORDS_CONSUMABLES FOREIGN KEY ([consumable_id]) 
        REFERENCES [dbo].[CONSUMABLES]([id]) ,
    [product_id] INT NOT NULL,
        CONSTRAINT FK_CONSUMABLE_PRODUCT_RECORDS_PRODUCTS FOREIGN KEY ([product_id]) 
        REFERENCES [dbo].[PRODUCTS]([id]) ,
)

CREATE TABLE [dbo].[ICMAL_DELIVERY_TYPES](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR (50) NOT NULL,
)

CREATE TABLE [dbo].[ICMAL_SOURCE_TYPES](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR (50) NOT NULL,
)

CREATE TABLE [dbo].[BATCH](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[bank_id] INT NOT NULL,
        CONSTRAINT FK_BATCH_BANKS FOREIGN KEY ([bank_id]) 
        REFERENCES [dbo].[BANKS]([id]) ,
	[description] NVARCHAR (500) NULL,
	[client_description] NVARCHAR (500) NULL,
	[created_at] DATETIME NOT NULL,
    [created_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_BATCH_CREATED_BY_USERS FOREIGN KEY ([created_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
)

CREATE TABLE [dbo].[ICMAL](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[description] NVARCHAR (500) NULL,
	[client_description] NVARCHAR (500) NULL,
    [batch_id] INT NOT NULL,
        CONSTRAINT FK_ICMAL_BATCH FOREIGN KEY ([batch_id]) 
        REFERENCES [dbo].[BATCH]([id]) ,
    [product_id] INT NOT NULL,
        CONSTRAINT FK_ICMAL_PRODUCTS FOREIGN KEY ([product_id]) 
        REFERENCES [dbo].[PRODUCTS]([id]) ,
    [icmal_delivery_type_id] INT NOT NULL,
        CONSTRAINT FK_ICMAL_ICMAL_DELIVERY_TYPES FOREIGN KEY ([icmal_delivery_type_id]) 
        REFERENCES [dbo].[ICMAL_DELIVERY_TYPES]([id]) ,
    [icmal_source_type_id] INT NOT NULL,
        CONSTRAINT FK_ICMAL_ICMAL_SOURCE_TYPES FOREIGN KEY ([icmal_source_type_id]) 
        REFERENCES [dbo].[ICMAL_SOURCE_TYPES]([id]) ,
    [quantity] INT NOT NULL,
	[created_at] DATETIME NOT NULL,
	[edited_at] DATETIME NULL,
    [created_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_ICMAL_CREATED_BY_USERS FOREIGN KEY ([created_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
    [edited_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_ICMAL_EDITED_BY_USERS FOREIGN KEY ([edited_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
)

CREATE TABLE [dbo].[ICMAL_STATUSES](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR (50) NOT NULL,
)

CREATE TABLE [dbo].[ICMAL_STATUS_RECORDS](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
    [icmal_id] INT NOT NULL,
        CONSTRAINT FK_ICMAL_STATUS_RECORDS_ICMAL FOREIGN KEY ([icmal_id]) 
        REFERENCES [dbo].[ICMAL]([id]) ,
    [icmal_status_id] INT NOT NULL,
        CONSTRAINT FK_ICMAL_STATUS_RECORDS_ICMAL_STATUSES FOREIGN KEY ([icmal_status_id]) 
        REFERENCES [dbo].[ICMAL_STATUSES]([id]) ,
	[created_at] DATETIME NOT NULL,
)

CREATE TABLE [dbo].[SHIFTS](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[description] NVARCHAR (500) NOT NULL,
    [start_hour] INT NOT NULL,
    [end_hour] INT NOT NULL,
    [is_active] BIT NOT NULL DEFAULT 1,
    [is_deleted] BIT NOT NULL DEFAULT 0,
	[created_at] DATETIME NOT NULL,
	[edited_at] DATETIME NULL,
    [created_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_SHIFTS_CREATED_BY_USERS FOREIGN KEY ([created_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
    [edited_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_SHIFTS_EDITED_BY_USERS FOREIGN KEY ([edited_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
)

CREATE TABLE [dbo].[PRINTERS](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR (255) NOT NULL,
	[description] NVARCHAR (1000) NOT NULL,
	[model] NVARCHAR (255) NOT NULL,
	[serial_no] NVARCHAR (255) NOT NULL,
    [is_active] BIT NOT NULL DEFAULT 1,
    [is_deleted] BIT NOT NULL DEFAULT 0,
	[created_at] DATETIME NOT NULL,
	[edited_at] DATETIME NULL,
    [created_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRINTERS_CREATED_BY_USERS FOREIGN KEY ([created_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
    [edited_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_PRINTERS_EDITED_BY_USERS FOREIGN KEY ([edited_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
)
 
CREATE UNIQUE INDEX PRINTERS_NAME_UNIQUE ON
    [dbo].[PRINTERS] ([name]);
GO
CREATE UNIQUE INDEX PRINTERS_SERIAL_UNIQUE ON
    [dbo].[PRINTERS] ([serial_no]);
GO

CREATE TABLE [dbo].[SHIFT_REPORTS](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[report_date] DATE NOT NULL,
    [shift_id] INT NOT NULL,
        CONSTRAINT FK_SHIFT_REPORTS_SHIFTS FOREIGN KEY ([shift_id]) 
        REFERENCES [dbo].[SHIFTS]([id]) ,
	[description] NVARCHAR (500) NOT NULL,
    [is_deleted] BIT NOT NULL DEFAULT 0,
	[created_at] DATETIME NOT NULL,
	[edited_at] DATETIME NULL,
    [created_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_SHIFT_REPORTS_CREATED_BY_USERS FOREIGN KEY ([created_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
    [edited_by] NVARCHAR(50) NULL,
        CONSTRAINT FK_SHIFT_REPORTS_EDITED_BY_USERS FOREIGN KEY ([edited_by]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
)

CREATE TABLE [dbo].[SHIFT_REPORT_PRINTER_RECORDS](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[shift_report_id] INT NOT NULL,
        CONSTRAINT FK_SHIFT_REPORT_PRINTER_RECORDS_SHIFT_REPORTS FOREIGN KEY ([shift_report_id]) 
        REFERENCES [dbo].[SHIFT_REPORTS]([id]) ,
	[printer_id] INT NOT NULL,
        CONSTRAINT FK_SHIFT_REPORT_PRINTER_RECORDS_PRINTERS FOREIGN KEY ([printer_id]) 
        REFERENCES [dbo].[PRINTERS]([id]) ,
	[counter_start] INT NOT NULL,
	[counter_end] INT NOT NULL,
	[description] NVARCHAR (500) NOT NULL,
)

CREATE TABLE [dbo].[SHIFT_REPORT_USER_RECORDS](
	[id] INT IDENTITY(1, 1) PRIMARY KEY,
	[shift_report_id] INT NOT NULL,
        CONSTRAINT FK_SHIFT_REPORT_USER_RECORDS_SHIFT_REPORTS FOREIGN KEY ([shift_report_id]) 
        REFERENCES [dbo].[SHIFT_REPORTS]([id]) ,
	[user_sicil] NVARCHAR (50) NOT NULL,
        CONSTRAINT FK_SHIFT_REPORT_USER_RECORDS_USERS FOREIGN KEY ([user_sicil]) 
        REFERENCES [dbo].[USERS]([sicil]) ,
	[description] NVARCHAR (500) NOT NULL,
)