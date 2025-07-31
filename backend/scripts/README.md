# Admin Account Creation Script

This script creates an admin account for the HeavenStay application.

## Usage

### Quick Start
```bash
cd backend
bun run create-admin
```

### Custom Admin Credentials

You can customize the admin account by setting environment variables:

```bash
ADMIN_EMAIL=your-admin@email.com \
ADMIN_PASSWORD=your-secure-password \
ADMIN_NAME="Your Admin Name" \
ADMIN_PHONE="+977-9800000000" \
bun run create-admin
```

### Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `ADMIN_EMAIL` | `admin@heavenstay.com` | Admin email address |
| `ADMIN_PASSWORD` | `admin123456` | Admin password |
| `ADMIN_NAME` | `System Administrator` | Admin full name |
| `ADMIN_PHONE` | `+977-9800000000` | Admin phone number |

## Features

- ✅ Checks if admin already exists
- 🔐 Automatically hashes password
- 📧 Sets email as verified
- 🛡️ Sets role as 'admin'
- ✅ Sets status as 'approved'
- 🔍 Validates input data
- 📝 Provides detailed feedback

## Security Notes

- **Change default password**: Always change the default password after first login
- **Strong passwords**: Use strong, unique passwords for production
- **Environment variables**: Store sensitive data in environment variables
- **Database access**: Ensure proper database permissions

## Example Output

```
Database connected successfully.
✅ Admin account created successfully!
📧 Email: admin@heavenstay.com
🔑 Password: admin123456
👤 Name: System Administrator
📱 Phone: +977-9800000000
🛡️ Role: admin

⚠️  IMPORTANT: Please change the default password after first login!
💡 You can set custom admin credentials using environment variables:
   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_PHONE
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env` file
- Verify database exists

### Admin Already Exists
- Script will exit gracefully if admin email already exists
- Use different email or delete existing admin first

### Validation Errors
- Check email format is valid
- Ensure password meets minimum requirements
- Verify phone number format

## Production Deployment

For production environments:

1. Set strong, unique credentials:
```bash
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-very-secure-password
ADMIN_NAME="Production Admin"
ADMIN_PHONE="+977-9800000000"
```

2. Run the script:
```bash
bun run create-admin
```

3. Immediately change the password after first login

4. Consider setting up 2FA for additional security