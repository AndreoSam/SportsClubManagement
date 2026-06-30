# Email Notification Integration

This document describes the email notification system implemented for the Sports Club Management application.

## Overview

Email notifications have been integrated for three key events:
1. **Registration Confirmation** - Sent immediately after athlete or coach registration
2. **Approval Notification** - Sent when admin approves an application
3. **Rejection Notification** - Sent when admin rejects an application

## Implementation Details

### Email Service (`backend/utils/emailNotifications.js`)

A new utility module that provides three email sending functions:

- **`sendRegistrationEmail(email, name, role)`** - Sends welcome email after registration
  - Confirms receipt of application
  - Notifies about review process
  - Professional HTML template with branding

- **`sendApprovalEmail(email, name, role)`** - Sends approval notification
  - Congratulates the applicant
  - Provides next steps to log in
  - Includes platform usage instructions

- **`sendRejectionEmail(email, name, role, rejectionReason)`** - Sends rejection notification
  - Explains rejection politely
  - Displays rejection reason
  - Suggests reapplication process

### Email Configuration

Uses Gmail SMTP with the following environment variables (already configured in `.env`):
- `EMAIL_USER` - Gmail account email
- `EMAIL_PASS` - Gmail App Password (use app-specific password, not regular password)

Connection settings:
- Host: smtp.gmail.com
- Port: 465
- Secure: true
- Connection pooling: 5 max connections, 100 max messages

## Integration Points

### 1. Athlete Registration
**File:** `backend/controllers/athleteController.js`

After successful athlete registration:
```javascript
await sendRegistrationEmail(data.personal.email, data.personal.fullName, "Athlete");
```

### 2. Coach Registration
**File:** `backend/controllers/coachController.js`

After successful coach registration:
```javascript
await sendRegistrationEmail(data.personal.email, data.personal.fullName, "Coach");
```

### 3. Admin Application Status Update
**File:** `backend/controllers/adminApplicationsController.js`

When admin updates application status:
- If `status === "Approved"`: Sends approval email
- If `status === "Rejected"`: Sends rejection email with reason
- If `status === "Pending"`: No email sent

## Email Templates

All emails include:
- Professional HTML styling
- Sports Club Management branding
- Clear subject lines
- Responsive design (max-width 600px)
- Color-coded sections (green for approval, red for rejection, blue for info)
- Footer with disclaimer

## Error Handling

All email sending is wrapped in try-catch blocks:
- Registration/approval/rejection proceeds even if email fails
- Email failures are logged to console
- User gets response regardless of email delivery status

## Testing

To test the email notifications:

1. **Registration Email**: Register as an athlete or coach - confirmation email will be sent
2. **Approval Email**: Admin approves the application - approval email will be sent to the registered email
3. **Rejection Email**: Admin rejects the application with a reason - rejection email will be sent

## Environment Requirements

Ensure the following are configured in `backend/.env`:
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-specific-password
```

**Important:** Use Gmail App Passwords, not your regular Gmail password.

To generate an App Password:
1. Go to Google Account settings
2. Enable 2-factor authentication
3. Generate an App Password for "Mail" and "Windows Computer"
4. Use that password in EMAIL_PASS

## Future Enhancements

Possible improvements:
- Add email templates with better customization
- Implement email queue system for better reliability
- Add email delivery tracking
- Send emails to admin when applications are received
- Add more notification events (profile updates, payment confirmations, etc.)
