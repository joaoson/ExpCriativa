import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import {
  fetchCurrentOrgProfile,
  updateOrgSettings,
  OrgProfile,
  UpdateOrgSettingsRequest
} from '@/service/organization-settings-service';

const Settings = () => {
  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState<UpdateOrgSettingsRequest>({
    orgName: '',
    phone: '',
    document: '',
    address: '',
    description: '',
    adminName: '',
    orgWebsiteUrl: '',
    orgFoundationDate: '',
    adminPhone: '',
  });

  // Load organization profile on component mount
  useEffect(() => {
    loadOrgProfile();
  }, []);

  const loadOrgProfile = async () => {
  try {
    const profile = await fetchCurrentOrgProfile();
    setOrgProfile(profile);
    
    // Helper function to format date safely
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      
      // Handle different date formats
      try {
        const date = new Date(dateString);
        
        // Check if date is valid and not a default .NET date
        if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
          return '';
        }
        
        // Format as yyyy-MM-dd for HTML date input
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.warn('Invalid date format:', dateString);
        return '';
      }
    };
    
    // Populate form with current data
    setFormData({
      orgName: profile.orgName,
      phone: profile.phone,
      document: profile.document,
      address: profile.address,
      description: profile.description,
      adminName: profile.adminName,
      orgWebsiteUrl: profile.orgWebsiteUrl || '',
      orgFoundationDate: formatDateForInput(profile.orgFoundationDate),
      adminPhone: profile.adminPhone,
    });
  } catch (error) {
    setMessage({ type: 'error', text: 'Failed to load organization profile' });
    console.error('Error loading profile:', error);
  } finally {
    setLoading(false);
  }
};

  const handleInputChange = (field: keyof UpdateOrgSettingsRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const updatedProfile = await updateOrgSettings(formData);
      setOrgProfile(updatedProfile);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

 


  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <div className="flex flex-col space-y-6 p-6 animate-fade-in">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your organization settings and preferences</p>
          </div>

          {message && (
            <Alert className={message.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}>
              <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="general">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Information</CardTitle>
                    <CardDescription>Update your organization details and administrative information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input 
                          id="orgName" 
                          value={formData.orgName}
                          onChange={(e) => handleInputChange('orgName', e.target.value)}
                          placeholder="Enter organization name" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orgWebsiteUrl">Website URL</Label>
                        <Input 
                          id="orgWebsiteUrl" 
                          value={formData.orgWebsiteUrl}
                          onChange={(e) => handleInputChange('orgWebsiteUrl', e.target.value)}
                          placeholder="https://your-organization.com" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter organization address" 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter phone number" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="document">Document/Registration</Label>
                        <Input 
                          id="document" 
                          value={formData.document}
                          onChange={(e) => handleInputChange('document', e.target.value)}
                          placeholder="Enter registration number" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input 
                        id="description" 
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Brief description of your organization" 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="adminName">Administrator Name</Label>
                        <Input 
                          id="adminName" 
                          value={formData.adminName}
                          onChange={(e) => handleInputChange('adminName', e.target.value)}
                          placeholder="Enter administrator name" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminPhone">Administrator Phone</Label>
                        <Input 
                          id="adminPhone" 
                          value={formData.adminPhone}
                          onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                          placeholder="Enter administrator phone" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orgFoundationDate">Foundation Date</Label>
                      <Input 
                        id="orgFoundationDate" 
                        type="date" 
                        value={formData.orgFoundationDate}
                        onChange={(e) => handleInputChange('orgFoundationDate', e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      className="mt-2" 
                      onClick={handleSaveSettings}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardContent>
                </Card>
              
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage your notification settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive email updates about your organization</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Donor Registration Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified when new donors register</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Donation Reports</p>
                      <p className="text-sm text-muted-foreground">Weekly donation activity reports</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-muted-foreground">Get notified about platform updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize your dashboard look and feel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Theme</Label>
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="border hover:border-lumen-500 cursor-pointer rounded-md p-4 text-center bg-white">
                          Light
                        </div>
                        <div className="border hover:border-lumen-500 cursor-pointer rounded-md p-4 text-center bg-gray-900 text-white">
                          Dark
                        </div>
                        <div className="border hover:border-lumen-500 cursor-pointer rounded-md p-4 text-center bg-gradient-to-r from-white to-gray-100">
                          System
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Accent Color</Label>
                      <div className="grid grid-cols-6 gap-2 pt-2">
                        <div className="h-10 rounded-md bg-lumen-500 cursor-pointer ring-2 ring-offset-2 ring-lumen-500"></div>
                        <div className="h-10 rounded-md bg-blue-500 cursor-pointer"></div>
                        <div className="h-10 rounded-md bg-purple-500 cursor-pointer"></div>
                        <div className="h-10 rounded-md bg-emerald-500 cursor-pointer"></div>
                        <div className="h-10 rounded-md bg-amber-500 cursor-pointer"></div>
                        <div className="h-10 rounded-md bg-rose-500 cursor-pointer"></div>
                      </div>
                    </div>
                    
                    <Button className="mt-4">Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;