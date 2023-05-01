DROP TABLE IF EXISTS [dbo].[banks]
DROP PROCEDURE IF EXISTS [dbo].[banks_get_bank]
DROP PROCEDURE IF EXISTS [dbo].[banks_get_banks]
DROP PROCEDURE IF EXISTS [dbo].[banks_add_bank]
DROP PROCEDURE IF EXISTS [dbo].[banks_edit_bank]
DROP PROCEDURE IF EXISTS [dbo].[banks_delete_bank]

CREATE TABLE [dbo].[banks](
    [bank_id] INT IDENTITY(1, 1) PRIMARY KEY,
    [bank_name] NVARCHAR(255) NOT NULL,
    [is_active] BIT NOT NULL,
    [is_deleted] BIT NOT NULL,
	[created_by] NVARCHAR(25) NULL,
	[edited_by] NVARCHAR(25) NULL,
	[created_at] DATETIME2 NOT NULL,
	[edited_at] DATETIME2 NULL
);

CREATE UNIQUE INDEX banks_bank_name_unique ON
    [dbo].[banks] ([bank_name]);
GO

CREATE PROCEDURE [dbo].[banks_get_bank]
	@bank_id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[banks]
		WHERE [bank_id] = @bank_id
	END;
GO

CREATE PROCEDURE [dbo].[banks_get_banks]
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[banks]
	END;
GO

CREATE PROCEDURE [dbo].[banks_add_bank]
	@bank_name NVARCHAR(255),
	@created_by  NVARCHAR(25) = NULL
	AS
	BEGIN 
     SET NOCOUNT ON;
		INSERT INTO [dbo].[banks]
		(
			[bank_name],
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
		SELECT SCOPE_IDENTITY()
	END;
GO

CREATE PROCEDURE [dbo].[banks_edit_bank]
	@bank_name NVARCHAR(255),
	@bank_id INT,
	@is_active BIT,
	@edited_by  NVARCHAR(25) = NULL
	AS
	BEGIN 
     SET NOCOUNT ON;
		UPDATE [dbo].[banks]
		SET 
			[bank_name] = @bank_name,
			[is_active] = @is_active,
			[edited_by] = @edited_by,
			[edited_at] = GETDATE()
		WHERE [bank_id] = @bank_id
	END;
GO

CREATE PROCEDURE [dbo].[banks_delete_bank]
	@bank_id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		UPDATE [dbo].[banks]
		SET 
			[bank_name] = @bank_name,
			[is_deleted] = 0,
		WHERE [bank_id] = @bank_id
	END;
GO