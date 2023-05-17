DROP PROCEDURE IF EXISTS [dbo].[BANKS_GET_BANK]
DROP PROCEDURE IF EXISTS [dbo].[BANKS_GET_BANKS]
DROP PROCEDURE IF EXISTS [dbo].[BANKS_ADD_BANK]
DROP PROCEDURE IF EXISTS [dbo].[BANKS_EDIT_BANK]
DROP PROCEDURE IF EXISTS [dbo].[BANKS_DELETE_BANK]

DROP PROCEDURE IF EXISTS [dbo].[PRINTERS_GET_PRINTER]
DROP PROCEDURE IF EXISTS [dbo].[PRINTERS_GET_PRINTERS]
DROP PROCEDURE IF EXISTS [dbo].[PRINTERS_ADD_PRINTER]
DROP PROCEDURE IF EXISTS [dbo].[PRINTERS_EDIT_PRINTER]
DROP PROCEDURE IF EXISTS [dbo].[PRINTERS_DELETE_PRINTER]

DROP PROCEDURE IF EXISTS [dbo].[SHIFTS_GET_SHIFT]
DROP PROCEDURE IF EXISTS [dbo].[SHIFTS_GET_SHIFTS]
DROP PROCEDURE IF EXISTS [dbo].[SHIFTS_ADD_SHIFT]
DROP PROCEDURE IF EXISTS [dbo].[SHIFTS_EDIT_SHIFT]
DROP PROCEDURE IF EXISTS [dbo].[SHIFTS_DELETE_SHIFT]

GO
CREATE OR ALTER PROCEDURE [dbo].[BANKS_GET_BANK]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[BANKS]
		WHERE [id] = @id AND [is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[BANKS_GET_BANKS]
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT
		[id]
		,banks.[name]
      ,[is_active]
      ,[is_deleted]
      ,[created_at]
      ,[edited_at]
      --,[CREATED_BY]
	  ,users1.[name] created_by
      --,[EDITED_BY]
	  ,users2.[name] edited_by
	FROM [dbo].[BANKS] banks
	LEFT JOIN [dbo].[USERS] users1
-- created by not null yaptığımızda inner join olsun
	ON banks.[created_by] = users1.[sicil]
-- created by not null yaptığımızda inner join olsun
	LEFT JOIN [dbo].[USERS] users2
	ON banks.[edited_by] = users2.[sicil]
	WHERE banks.[is_deleted] = 0
	END;
GO


CREATE OR ALTER PROCEDURE [dbo].[BANKS_ADD_BANK]
	@name NVARCHAR(255),
	@created_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		BEGIN
			INSERT INTO [dbo].[BANKS]
			(
				[name],
				[is_active],
				[is_deleted],
				[created_by],
				[created_at]
			)
			VALUES
			(
				@name,
				1,
				0,
				@created_by,
				GETDATE()
			)
			RETURN SCOPE_IDENTITY()
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[BANKS_EDIT_BANK]
	@name NVARCHAR(255),
	@id INT,
	@is_active BIT,
	@edited_by  NVARCHAR(50) = NULL
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[BANKS] WHERE [id] = @id  AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[BANKS]
			SET 
				[name] = @name,
				[is_active] = @is_active,
				[edited_by] = @edited_by,
				[edited_at] = GETDATE()
			WHERE [id] = @id AND [is_deleted] = 0
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[BANKS_DELETE_BANK]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[BANKS] WHERE [id] = @id AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[BANKS]
			SET 
				[is_deleted] = 1,
				[is_active] = 0
			WHERE [id] = @id
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

GO
CREATE OR ALTER PROCEDURE [dbo].[PRINTERS_GET_PRINTER]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[PRINTERS]
		WHERE [id] = @id AND [is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRINTERS_GET_PRINTERS]
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT
		[id]
		,printers.[name]
      ,[description]
      ,[model]
      ,[serial_no]
      ,[is_active]
      ,[is_deleted]
      ,[created_at]
      ,[edited_at]
      --,[CREATED_BY]
	  ,users1.[name] created_by
      --,[EDITED_BY]
	  ,users2.[name] edited_by
	FROM [dbo].[PRINTERS] printers
	LEFT JOIN [dbo].[USERS] users1
-- created by not null yaptığımızda inner join olsun
	ON printers.[created_by] = users1.[sicil]
-- created by not null yaptığımızda inner join olsun
	LEFT JOIN [dbo].[USERS] users2
	ON printers.[edited_by] = users2.[sicil]
	WHERE printers.[is_deleted] = 0
	END;
GO


CREATE OR ALTER PROCEDURE [dbo].[PRINTERS_ADD_PRINTER]
	@name NVARCHAR(255),
	@model NVARCHAR(255),
	@serial_no NVARCHAR(255),
	@description NVARCHAR(1000),
	@created_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		BEGIN
			INSERT INTO [dbo].[PRINTERS]
			(
				[name],
				[model],
				[serial_no],
				[description],
				[is_active],
				[is_deleted],
				[created_by],
				[created_at]
			)
			VALUES
			(
				@name,
				@model,
				@serial_no,
				@description,
				1,
				0,
				@created_by,
				GETDATE()
			)
			RETURN SCOPE_IDENTITY()
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRINTERS_EDIT_PRINTER]
	@name NVARCHAR(255),
	@model NVARCHAR(255),
	@serial_no NVARCHAR(255),
	@description NVARCHAR(1000),
	@id INT,
	@is_active BIT,
	@edited_by  NVARCHAR(50) = NULL
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[PRINTERS] WHERE [id] = @id  AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[PRINTERS]
			SET 
				[name] = @name,
				[model] = @model,
				[serial_no] = @serial_no,
				[description] = @description,
				[is_active] = @is_active,
				[edited_by] = @edited_by,
				[edited_at] = GETDATE()
			WHERE [id] = @id AND [is_deleted] = 0
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRINTERS_DELETE_PRINTER]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[PRINTERS] WHERE [id] = @id AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[PRINTERS]
			SET 
				[is_deleted] = 1,
				[is_active] = 0
			WHERE [id] = @id
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO


-- SHIFT SPs:
-- dbo.SHIFTS_GET_SHIFTS
-- dbo.SHIFTS_DELETE_SHIFT
-- dbo.SHIFTS_GET_SHIFT
-- dbo.SHIFTS_ADD_SHIFT
-- dbo.SHIFTS_EDIT_SHIFT

GO
CREATE OR ALTER PROCEDURE [dbo].[SHIFTS_GET_SHIFT]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[SHIFTS]
		WHERE [id] = @id AND [is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[SHIFTS_GET_SHIFTS]
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT
		[id]
      ,[description]
      ,[start_hour]
      ,[end_hour]
      ,[is_active]
      ,[is_deleted]
      ,[created_at]
      ,[edited_at]
      --,[CREATED_BY]
	  ,users1.[name] created_by
      --,[EDITED_BY]
	  ,users2.[name] edited_by
	FROM [dbo].[SHIFTS] shifts
	LEFT JOIN [dbo].[USERS] users1
-- created by not null yaptığımızda inner join olsun
	ON shifts.[created_by] = users1.[sicil]
-- created by not null yaptığımızda inner join olsun
	LEFT JOIN [dbo].[USERS] users2
	ON shifts.[edited_by] = users2.[sicil]
	WHERE shifts.[is_deleted] = 0
	END;
GO


CREATE OR ALTER PROCEDURE [dbo].[SHIFTS_ADD_SHIFT]
	@description NVARCHAR(500),
	@start_hour INT,
	@end_hour INT,
	@created_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		BEGIN
			INSERT INTO [dbo].[SHIFTS]
			(
				[description],
				[start_hour],
				[end_hour],
				[is_active],
				[is_deleted],
				[created_by],
				[created_at]
			)
			VALUES
			(
				@description,
				@start_hour,
				@end_hour,
				1,
				0,
				@created_by,
				GETDATE()
			)
			RETURN SCOPE_IDENTITY()
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[SHIFTS_EDIT_SHIFT]
	@id INT,
	@description NVARCHAR(500),
	@start_hour INT,
	@end_hour INT,
	@is_active BIT,
	@edited_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[SHIFTS] WHERE [id] = @id  AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[SHIFTS]
			SET 
				[description] = @description,
				[start_hour] = @start_hour,
				[end_hour] = @end_hour,
				[is_active] = @is_active,
				[edited_by] = @edited_by,
				[edited_at] = GETDATE()
			WHERE [id] = @id AND [is_deleted] = 0
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[SHIFTS_DELETE_SHIFT]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[SHIFTS] WHERE [id] = @id AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[SHIFTS]
			SET 
				[is_deleted] = 1,
				[is_active] = 0
			WHERE [id] = @id
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO