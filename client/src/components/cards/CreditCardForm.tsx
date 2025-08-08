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
      name: defaultValues?.name || "",
      type: defaultValues?.type || "CREDIT",
      brand: defaultValues?.brand || "OTHER",
      last_digits: defaultValues?.last_digits || "",
      color: defaultValues?.color || "#2563eb",
      credit_limit: defaultValues?.credit_limit || null,
      available_limit: defaultValues?.available_limit || null,
      closing_day: defaultValues?.closing_day || null,
      due_day: defaultValues?.due_day || null,
      is_default: defaultValues?.is_default || false,
      is_virtual: defaultValues?.is_virtual || false,
      parent_card_id: defaultValues?.parent_card_id || null,
    },
  });

  const watchType = form.watch("type");
  const watchIsVirtual = form.watch("is_virtual");
  const isCreditCard = watchType === "CREDIT" || watchType === "CREDIT_DEBIT";

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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        />
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
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        />
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
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
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
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
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