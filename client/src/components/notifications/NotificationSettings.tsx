import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  CreditCard, 
  DollarSign, 
  Clock,
  Save
} from "lucide-react";
import { formatCurrency } from "@/lib/currency-utils";

interface NotificationSettingsProps {
  onSave?: (settings: any) => void;
}

export function NotificationSettings({ onSave }: NotificationSettingsProps) {
  const [settings, setSettings] = useState({
    // Canais de notificação
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    
    // Lembretes de faturas
    bill_reminders: {
      enabled: true,
      days_before: [1, 3, 7]
    },
    
    // Alertas de gastos
    spending_alerts: {
      enabled: true,
      daily_limit: 500,
      weekly_limit: 2000,
      monthly_limit: 8000
    },
    
    // Alertas de orçamento
    budget_alerts: {
      enabled: true,
      threshold_percentage: 80
    },
    
    // Alertas de saldo baixo
    low_balance_alerts: {
      enabled: true,
      minimum_balance: 500
    },
    
    // Alertas de limite do cartão
    card_limit_alerts: {
      enabled: true,
      threshold_percentage: 85
    },
    
    // Horário de silêncio
    quiet_hours: {
      enabled: true,
      start_time: "22:00",
      end_time: "08:00"
    }
  });

  const handleSave = () => {
    if (onSave) {
      onSave(settings);
    }
  };

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.');
    const newSettings = JSON.parse(JSON.stringify(settings)); // Deep clone
    let current = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold">Configurações de Notificações</h2>
        <p className="text-muted-foreground">
          Configure como e quando você quer receber notificações
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Canais de Notificação
          </CardTitle>
          <CardDescription>
            Escolha como você quer receber suas notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4" />
              <div>
                <Label>Notificações por E-mail</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas importantes no seu e-mail
                </p>
              </div>
            </div>
            <Switch
              checked={settings.email_notifications}
              onCheckedChange={(value) => updateSetting('email_notifications', value)}
              data-testid="switch-email-notifications"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4" />
              <div>
                <Label>Notificações Push</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações no seu dispositivo
                </p>
              </div>
            </div>
            <Switch
              checked={settings.push_notifications}
              onCheckedChange={(value) => updateSetting('push_notifications', value)}
              data-testid="switch-push-notifications"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4" />
              <div>
                <Label>Notificações por SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas urgentes via SMS
                </p>
              </div>
            </div>
            <Switch
              checked={settings.sms_notifications}
              onCheckedChange={(value) => updateSetting('sms_notifications', value)}
              data-testid="switch-sms-notifications"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Lembretes de Vencimento
          </CardTitle>
          <CardDescription>
            Configure quando ser lembrado sobre faturas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Ativar lembretes de faturas</Label>
            <Switch
              checked={settings.bill_reminders.enabled}
              onCheckedChange={(value) => updateSetting('bill_reminders.enabled', value)}
              data-testid="switch-bill-reminders"
            />
          </div>
          
          {settings.bill_reminders.enabled && (
            <div className="space-y-2">
              <Label>Lembrar quantos dias antes do vencimento</Label>
              <div className="flex gap-2 flex-wrap">
                {[1, 3, 5, 7, 10].map(days => (
                  <Button
                    key={days}
                    variant={settings.bill_reminders.days_before.includes(days) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const current = settings.bill_reminders.days_before;
                      const newDays = current.includes(days)
                        ? current.filter(d => d !== days)
                        : [...current, days].sort();
                      updateSetting('bill_reminders.days_before', newDays);
                    }}
                    data-testid={`button-days-${days}`}
                  >
                    {days} {days === 1 ? 'dia' : 'dias'}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Alertas de Gastos
          </CardTitle>
          <CardDescription>
            Seja notificado quando ultrapassar limites de gastos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Ativar alertas de gastos</Label>
            <Switch
              checked={settings.spending_alerts.enabled}
              onCheckedChange={(value) => updateSetting('spending_alerts.enabled', value)}
              data-testid="switch-spending-alerts"
            />
          </div>
          
          {settings.spending_alerts.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Limite diário</Label>
                <Input
                  type="number"
                  value={settings.spending_alerts.daily_limit}
                  onChange={(e) => updateSetting('spending_alerts.daily_limit', Number(e.target.value))}
                  placeholder="500"
                  data-testid="input-daily-limit"
                />
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(settings.spending_alerts.daily_limit || 0)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Limite semanal</Label>
                <Input
                  type="number"
                  value={settings.spending_alerts.weekly_limit}
                  onChange={(e) => updateSetting('spending_alerts.weekly_limit', Number(e.target.value))}
                  placeholder="2000"
                  data-testid="input-weekly-limit"
                />
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(settings.spending_alerts.weekly_limit || 0)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Limite mensal</Label>
                <Input
                  type="number"
                  value={settings.spending_alerts.monthly_limit}
                  onChange={(e) => updateSetting('spending_alerts.monthly_limit', Number(e.target.value))}
                  placeholder="8000"
                  data-testid="input-monthly-limit"
                />
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(settings.spending_alerts.monthly_limit || 0)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horário de Silêncio
          </CardTitle>
          <CardDescription>
            Configure um período para não receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Ativar horário de silêncio</Label>
            <Switch
              checked={settings.quiet_hours.enabled}
              onCheckedChange={(value) => updateSetting('quiet_hours.enabled', value)}
              data-testid="switch-quiet-hours"
            />
          </div>
          
          {settings.quiet_hours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Início</Label>
                <Input
                  type="time"
                  value={settings.quiet_hours.start_time}
                  onChange={(e) => updateSetting('quiet_hours.start_time', e.target.value)}
                  data-testid="input-quiet-start"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Fim</Label>
                <Input
                  type="time"
                  value={settings.quiet_hours.end_time}
                  onChange={(e) => updateSetting('quiet_hours.end_time', e.target.value)}
                  data-testid="input-quiet-end"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} data-testid="button-save-settings">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}