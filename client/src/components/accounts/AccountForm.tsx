import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, type AccountFormData, accountTypeOptions, accountColorOptions } from "@/lib/validations/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { CreditCard, PiggyBank, TrendingUp, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountFormProps {
  onSubmit: (data: AccountFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<AccountFormData>;
  isLoading?: boolean;
  submitText?: string;
}

const iconMap = {
  CreditCard,
  PiggyBank,
  TrendingUp,
  Banknote,
};

export function AccountForm({ onSubmit, onCancel, defaultValues, isLoading, submitText = "Criar Conta" }: AccountFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      initial_balance: 0,
      color: "#2196F3",
      is_default: false,
      include_in_total: true,
      ...defaultValues,
    },
  });

  const selectedType = watch("type");
  const selectedColor = watch("color");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Conta</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Ex: Banco do Brasil - Corrente"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Conta</Label>
          <Select value={selectedType || ""} onValueChange={(value) => setValue("type", value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {accountTypeOptions.map((option) => {
                const Icon = iconMap[option.icon];
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="initial_balance">Saldo Inicial</Label>
          <Input
            id="initial_balance"
            type="number"
            step="0.01"
            {...register("initial_balance", { valueAsNumber: true })}
            placeholder="0,00"
          />
          {errors.initial_balance && (
            <p className="text-sm text-destructive">{errors.initial_balance.message}</p>
          )}
        </div>
      </div>

      {/* Bank Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Informações do Banco (Opcional)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bank_name">Nome do Banco</Label>
            <Input
              id="bank_name"
              {...register("bank_name")}
              placeholder="Ex: Banco do Brasil"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank_code">Código do Banco</Label>
            <Input
              id="bank_code"
              {...register("bank_code")}
              placeholder="Ex: 001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agency_number">Agência</Label>
            <Input
              id="agency_number"
              {...register("agency_number")}
              placeholder="Ex: 1234-5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_number">Número da Conta</Label>
            <Input
              id="account_number"
              {...register("account_number")}
              placeholder="Ex: 12345-6"
            />
          </div>
        </div>
      </div>

      {/* Customization */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Personalização</h3>
        
        <div className="space-y-2">
          <Label>Cor da Conta</Label>
          <div className="grid grid-cols-5 gap-2">
            {accountColorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue("color", color)}
                className={cn(
                  "w-10 h-10 rounded-md border-2 transition-all",
                  selectedColor === color
                    ? "border-primary scale-110"
                    : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Opções</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Conta Padrão</Label>
              <p className="text-sm text-muted-foreground">
                Esta será a conta selecionada por padrão
              </p>
            </div>
            <Switch
              checked={watch("is_default")}
              onCheckedChange={(checked) => setValue("is_default", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Incluir no Total</Label>
              <p className="text-sm text-muted-foreground">
                Incluir saldo desta conta no valor total
              </p>
            </div>
            <Switch
              checked={watch("include_in_total")}
              onCheckedChange={(checked) => setValue("include_in_total", checked)}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? "Salvando..." : submitText}
        </Button>
      </div>
    </form>
  );
}