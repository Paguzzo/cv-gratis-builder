import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PhotoUpload } from '@/components/ui/photo-upload';
import { usePersonalInfo } from '@/contexts/PersonalInfoContext';
import { useEffect, useState } from 'react';

const personalInfoSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  photo: z.string().optional(),
  isRoundPhoto: z.boolean().optional(),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

export function PersonalInfo() {
  const { state, updatePersonalInfo } = usePersonalInfo();
  const [sameAsPhone, setSameAsPhone] = useState(false);
  
  const form = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: state.data,
  });

  // Update context when form values change
  useEffect(() => {
    const subscription = form.watch((data) => {
      updatePersonalInfo(data);
    });
    return () => subscription.unsubscribe();
  }, [form, updatePersonalInfo]);

  // Sync WhatsApp with phone when checkbox is checked
  useEffect(() => {
    if (sameAsPhone) {
      const phoneValue = form.watch('phone');
      form.setValue('whatsapp', phoneValue);
    }
  }, [sameAsPhone, form.watch('phone'), form]);

  const handleSameAsPhoneChange = (checked: boolean) => {
    setSameAsPhone(checked);
    if (checked) {
      const phoneValue = form.getValues('phone');
      form.setValue('whatsapp', phoneValue);
    } else {
      form.setValue('whatsapp', '');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>
          Vamos começar com suas informações básicas. Estes dados aparecerão no cabeçalho do seu currículo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
            {/* Campo de Foto */}
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto do Perfil</FormLabel>
                  <FormControl>
                    <PhotoUpload
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Opção de Foto Redonda */}
            <FormField
              control={form.control}
              name="isRoundPhoto"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      Foto Redonda
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Marque para que sua foto apareça em formato circular nos templates
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone *</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(11) 99999-9999" 
                        {...field} 
                        disabled={sameAsPhone}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="same-as-phone"
                checked={sameAsPhone}
                onCheckedChange={handleSameAsPhoneChange}
              />
              <label 
                htmlFor="same-as-phone" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                WhatsApp é o mesmo número do telefone
              </label>
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade, Estado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}