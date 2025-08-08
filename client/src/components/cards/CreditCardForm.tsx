import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { creditCardSchema, CreditCardFormData } from "@/lib/validations/credit-card";
import { CreditCard } from "@/hooks/useCreditCards";
import { formatCurrencyInput } from "@/lib/currency-format";
import { useCurrencyInput } from "@/hooks/useCurrencyInput";
import { parseCurrency } from "@/lib/currency-utils";
import { featureFlags } from "@/lib/featureFlags";

interface CreditCardFormProps {
  onSubmit: (data: CreditCardFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<CreditCard>;
  availableParentCards?: CreditCard[];
}

const cardColors = [
  { value: "#1f2937", label: "Cinza Escuro" },
  { value: "#dc2626", label: "Vermelho" },
  { value: "#2563eb", label: "Azul" },
  { value: "#16a34a", label: "Verde" },
  { value: "#ca8a04", label: "Amarelo" },
  { value: "#9333ea", label: "Roxo" },
  { value: "#c2410c", label: "Laranja" },
  { value: "#be185d", label: "Rosa" },
];

export function CreditCardForm({ 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  defaultValues,
  availableParentCards = []
}: CreditCardFormProps) {
  const form = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      name: "",
      type: "CREDIT",
      brand: "OTHER",
      last_digits: "",
      color: "#2563eb",
      credit_limit: "0,00",
      available_limit: "0,00",
      closing_day: "1",
      due_day: "1",
      is_default: false,
      is_virtual: false,
      parent_card_id: null,
    },
  });

  // Quando editar um cartão, reidrata os valores do formulário
  React.useEffect(() => {
    if (defaultValues) {
      const values: CreditCardFormData = {
        name: defaultValues?.name || "",
        type: (defaultValues as any)?.type || "CREDIT",
        brand: (defaultValues as any)?.brand || "OTHER",
        // Mapear lastFourDigits do backend para last_digits do frontend
        last_digits: (defaultValues as any)?.lastFourDigits || (defaultValues as any)?.last_digits || "",
        color: (defaultValues as any)?.color || "#2563eb",
        // Mapear limit do backend para credit_limit do frontend
        credit_limit: (() => {
          // Backend pode enviar limit, credit_limit, ou values como decimal string
          const backendLimit = (defaultValues as any)?.limit || (defaultValues as any)?.credit_limit;
          if (featureFlags.isEnabled('debugMode')) {
            console.log('🎯 Debug limit field:', { 
              defaultValues, 
              backendLimit,
              type: typeof backendLimit 
            });
          }
          if (backendLimit !== undefined && backendLimit !== null) {
            const formatted = formatCurrencyInput(backendLimit);
            if (featureFlags.isEnabled('debugMode')) {
              console.log('🎯 Formatando limit:', { original: backendLimit, formatted });
            }
            return formatted;
          }
          return "0,00";
        })(),
        // Mapear availableLimit do backend para available_limit do frontend
        available_limit: (() => {
          // Backend pode enviar availableLimit, available_limit, ou values como decimal string
          const backendAvailable = (defaultValues as any)?.availableLimit || (defaultValues as any)?.available_limit;
          if (featureFlags.isEnabled('debugMode')) {
            console.log('🎯 Debug available_limit field:', { 
              defaultValues, 
              backendAvailable,
              type: typeof backendAvailable 
            });
          }
          if (backendAvailable !== undefined && backendAvailable !== null) {
            const formatted = formatCurrencyInput(backendAvailable);
            if (featureFlags.isEnabled('debugMode')) {
              console.log('🎯 Formatando availableLimit:', { original: backendAvailable, formatted });
            }
            return formatted;
          }
          return "0,00";
        })(),
        // Mapear closingDay do backend para closing_day do frontend
        closing_day: (defaultValues as any)?.closingDay?.toString() || 
                     (defaultValues as any)?.closing_day?.toString() || "1",
        // Mapear dueDay do backend para due_day do frontend
        due_day: (defaultValues as any)?.dueDay?.toString() || 
                 (defaultValues as any)?.due_day?.toString() || "1",
        // Mapear isDefault do backend para is_default do frontend
        is_default: (defaultValues as any)?.isDefault ?? (defaultValues as any)?.is_default ?? false,
        is_virtual: (defaultValues as any)?.is_virtual || false,
        parent_card_id: (defaultValues as any)?.parent_card_id || null,
      };
      form.reset(values);
      
      if (featureFlags.isEnabled('debugMode')) {
        console.log('🎯 CreditCardForm: Mapeando dados para edição', {
          backend: defaultValues,
          frontend: values
        });
      }
    }
  }, [defaultValues]);

  const watchType = form.watch("type");
  const watchIsVirtual = form.watch("is_virtual");
  const isCreditCard = watchType === "CREDIT" || watchType === "CREDIT_DEBIT";

  function CurrencyInputField({ field, placeholder = "0,00" }: { field: any; placeholder?: string }) {
    const initialNumeric = React.useMemo(() => {
      return parseCurrency(String(field.value ?? ""));
    }, [field.value]);

    const { displayValue, handleChange, handleBlur, handleFocus, setDisplayValue } = useCurrencyInput({
      initialValue: isNaN(initialNumeric) ? 0 : initialNumeric,
    });

    // Mantém o display sincronizado quando o form injeta valores (ex.: edição)
    React.useEffect(() => {
      const current = String(field.value ?? "");
      if (current !== displayValue) {
        setDisplayValue(current);
      }
    }, [field.value]);

    // Propaga a string mascarada para o RHF
    React.useEffect(() => {
      if (displayValue !== field.value) {
        field.onChange(displayValue);
      }
    }, [displayValue]);

    return (
      <Input
        type="text"
        inputMode="decimal"
        lang="pt-BR"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cartão</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Cartão Principal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CREDIT">Crédito</SelectItem>
                    <SelectItem value="DEBIT">Débito</SelectItem>
                    <SelectItem value="CREDIT_DEBIT">Múltiplo</SelectItem>
                    <SelectItem value="PREPAID">Pré-pago</SelectItem>
                    <SelectItem value="VIRTUAL">Virtual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bandeira</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a bandeira" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="VISA">Visa</SelectItem>
                    <SelectItem value="MASTERCARD">Mastercard</SelectItem>
                    <SelectItem value="ELO">Elo</SelectItem>
                    <SelectItem value="AMEX">American Express</SelectItem>
                    <SelectItem value="HIPERCARD">Hipercard</SelectItem>
                    <SelectItem value="OTHER">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_digits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Últimos 4 Dígitos</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="1234" 
                    maxLength={4}
                    {...field} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor</FormLabel>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {cardColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-8 h-8 rounded-md border-2 transition-all ${
                      field.value === color.value 
                        ? 'border-primary scale-110' 
                        : 'border-border hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => field.onChange(color.value)}
                    title={color.label}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {isCreditCard && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações de Crédito</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="credit_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite de Crédito</FormLabel>
                      <FormControl>
                        <CurrencyInputField field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="available_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite Disponível</FormLabel>
                      <FormControl>
                        <CurrencyInputField field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="closing_day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia do Fechamento</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="31"
                          placeholder="15"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="due_day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia do Vencimento</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="31"
                          placeholder="10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        )}

        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Configurações</h3>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="is_default"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Cartão Padrão</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Este cartão será selecionado automaticamente em novas transações
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_virtual"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Cartão Virtual</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Cartão virtual vinculado a um cartão físico principal
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {watchIsVirtual && availableParentCards.length > 0 && (
              <FormField
                control={form.control}
                name="parent_card_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cartão Principal</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cartão principal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableParentCards.map((card) => (
                          <SelectItem key={card.id} value={card.id}>
                            {card.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}