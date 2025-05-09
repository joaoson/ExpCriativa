import React from 'react';
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

const Settings = () => {
  return (
    <div className="flex flex-col space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your institution settings and preferences</p>
      </div>
      
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
                <CardTitle>Institution Information</CardTitle>
                <CardDescription>Update your institution details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institutionName">Institution Name</Label>
                    <Input id="institutionName" defaultValue="University Institute" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://university-institute.edu" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Campus Drive" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="University City" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" defaultValue="CA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input id="zipCode" defaultValue="90210" />
                  </div>
                </div>
                <Button className="mt-2">Save Changes</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>API Integration</CardTitle>
                <CardDescription>Manage API keys and integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input id="apiKey" defaultValue="" type="password" />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                </div>
                <Button variant="outline">Download API Documentation</Button>
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
                  <p className="text-sm text-muted-foreground">Receive email updates about your institution</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Student Enrollment Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when new students enroll</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Performance Reports</p>
                  <p className="text-sm text-muted-foreground">Weekly performance metrics reports</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Resource Updates</p>
                  <p className="text-sm text-muted-foreground">Get notified about new resources</p>
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
  );
};

export default Settings