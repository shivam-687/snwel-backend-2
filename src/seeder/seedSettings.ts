import { EMAIL_TRANSPORTER, SETTINGS } from '@/entity-schema/setting-schema';
import { SettingModel } from '@/models/Setting';


const seedSettings = async () => {
  try {
  
    const settings = [
      {
        code: SETTINGS.GENERAL,
        data: {
          siteName: "My Awesome Site",
          logoUrl: "https://example.com/logo.png",
          location: {
            address: "123 Main St",
            city: "Anytown",
            state: "Anystate",
            country: "Anyland"
          },
          contacts: {
            phone: "+1234567890",
            email: "contact@example.com"
          }
        },
        isChangable: true
      },
      {
        code: SETTINGS.INTEGRATION,
        data: {
          whatsapp: {
            appKey: "whatsapp-app-key",
            authKey: "whatsapp-auth-key",
            message: "Welcome to our service"
          }
        },
        isChangable: true
      },
      {
        code: SETTINGS.EMAIL,
        data: {
          [EMAIL_TRANSPORTER.RESEND]: {
            token: "re_UhUC3YLC_EMhuRzCerGkWAw48edEZfVkt"
          }
        },
        isChangable: true
      }
    ];

    await SettingModel.insertMany(settings);
    console.log('Seed data inserted successfully');

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedSettings();
