import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { EmailService } from "@/services/emailService";
import { PDFExportService } from "@/services/pdfExportService";
import MCPEmailService, { CurriculumEmailData } from "@/services/mcpEmailService";
import { Mail, Send, Loader2 } from "lucide-react";

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: string;
  senderName: string;
}

export function EmailDialog({ open, onOpenChange, templateId, senderName }: EmailDialogProps) {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    recipientName: '',
    subject: 'Meu Currículo Profissional',
    message: 'Olá!\n\nSegue em anexo meu currículo atualizado para sua análise.\n\nAguardo seu retorno.\n\nAtenciosamente.'
  });
  const [isSending, setIsSending] = useState(false);
  const [sendWithAttachment, setSendWithAttachment] = useState(true);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendEmail = async () => {
    if (!formData.recipientEmail) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe o email do destinatário.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    try {
      // Usar novo serviço MCP para envio
      const curriculumData: CurriculumEmailData = {
        recipientEmail: formData.recipientEmail,
        recipientName: formData.recipientName,
        senderName: senderName,
        subject: formData.subject,
        message: formData.message,
        templateId: templateId
      };

      // Enviar via MCP (inclui geração automática de PDF e fallback)
      const result = await MCPEmailService.sendCurriculumByEmail(curriculumData);

      if (!result.success) {
        throw new Error(result.error || 'Falha no envio via MCP');
      }

      toast({
        title: "Email enviado com sucesso! ✅",
        description: `Currículo enviado para ${formData.recipientEmail}. ID: ${result.emailId}`,
      });

      onOpenChange(false);

      // Limpar formulário
      setFormData({
        recipientEmail: '',
        recipientName: '',
        subject: 'Meu Currículo Profissional',
        message: 'Olá!\n\nSegue em anexo meu currículo atualizado para sua análise.\n\nAguardo seu retorno.\n\nAtenciosamente.'
      });

    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast({
        title: "Erro ao enviar",
        description: error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Enviar Currículo por Email
          </DialogTitle>
          <DialogDescription>
            Envie seu currículo diretamente para o email do destinatário.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="recipientEmail">Email do destinatário *</Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="contato@empresa.com"
              value={formData.recipientEmail}
              onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipientName">Nome do destinatário</Label>
            <Input
              id="recipientName"
              placeholder="João Silva"
              value={formData.recipientName}
              onChange={(e) => handleInputChange('recipientName', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sendWithAttachment"
              checked={sendWithAttachment}
              onChange={(e) => setSendWithAttachment(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="sendWithAttachment" className="text-sm">
              Enviar PDF em anexo (recomendado)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSendEmail} disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}