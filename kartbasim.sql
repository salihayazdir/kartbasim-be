DROP TABLE IF EXISTS [dbo].[banks]
DROP PROCEDURE IF EXISTS [dbo].[banks_get_bank]
DROP PROCEDURE IF EXISTS [dbo].[banks_get_banks]
DROP PROCEDURE IF EXISTS [dbo].[banks_add_bank]
DROP PROCEDURE IF EXISTS [dbo].[banks_edit_bank]
DROP PROCEDURE IF EXISTS [dbo].[banks_delete_bank]

CREATE TABLE [dbo].[banks](
    [bank_id] INT IDENTITY(1, 1) PRIMARY KEY,
    [bank_name] NVARCHAR(255) NOT NULL,
    [is_active] BIT NOT NULL
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
	@bank_name NVARCHAR(255)
	AS
	BEGIN 
     SET NOCOUNT ON;
		INSERT INTO [dbo].[banks]
		(
			[bank_name],
			[is_active]
		)
		VALUES
		(
			@bank_name,
			1
		)
		SELECT SCOPE_IDENTITY()
	END;
GO

CREATE PROCEDURE [dbo].[banks_edit_bank]
	@bank_name NVARCHAR(255),
	@bank_id INT,
	@is_active BIT
	AS
	BEGIN 
     SET NOCOUNT ON;
		UPDATE [dbo].[banks]
		SET 
			[bank_name] = @bank_name,
			[is_active] = @is_active
		WHERE [bank_id] = @bank_id
	END;
GO

CREATE PROCEDURE [dbo].[banks_delete_bank]
	@bank_id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		DELETE FROM [dbo].[banks]
		WHERE [bank_id] = @bank_id
	END;
GO
