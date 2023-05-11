DROP PROCEDURE IF EXISTS [dbo].[BANKS_GET_BANK]
DROP PROCEDURE IF EXISTS [dbo].[BANKS_GET_BANK_BY_NAME]
DROP PROCEDURE IF EXISTS [dbo].[BANKS_GET_BANKS]
DROP PROCEDURE IF EXISTS [dbo].[BANKS_ADD_BANK]
DROP PROCEDURE IF EXISTS [dbo].[BANKS_EDIT_BANK]
DROP PROCEDURE IF EXISTS [dbo].[BANKS_DELETE_BANK]

GO
CREATE OR ALTER PROCEDURE [dbo].[BANKS_GET_BANK]
	@bank_id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[BANKS]
		WHERE [id] = @bank_id AND [is_deleted] = 0
	END;
GO

GO
CREATE OR ALTER PROCEDURE [dbo].[BANKS_GET_BANK_BY_NAME]
	@bank_name NVARCHAR(255)
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[BANKS]
		WHERE [name] = @bank_name
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
	@bank_name NVARCHAR(255),
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
				@bank_name,
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
	@bank_name NVARCHAR(255),
	@bank_id INT,
	@is_active BIT,
	@edited_by  NVARCHAR(50) = NULL
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[BANKS] WHERE [id] = @bank_id  AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[BANKS]
			SET 
				[name] = @bank_name,
				[is_active] = @is_active,
				[edited_by] = @edited_by,
				[edited_at] = GETDATE()
			WHERE [id] = @bank_id AND [is_deleted] = 0
			RETURN @bank_id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[BANKS_DELETE_BANK]
	@bank_id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[BANKS] WHERE [id] = @bank_id AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[BANKS]
			SET 
				[is_deleted] = 1,
				[is_active] = 0
			WHERE [id] = @bank_id
			RETURN @bank_id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO