import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Box, Button } from '@mui/material';
import QRCode from 'react-qr-code';

interface ModalQRProps {
  open: boolean;
  onClose: () => void;
  linkPago: string;
}

export default function ModalQR({ open, onClose, linkPago }: ModalQRProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(linkPago);
    // Aquí podrías mostrar una notificación de que se copió
  };

  const handleOpenLink = () => {
    window.open(linkPago, '_blank');
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
              maxHeight: '90vh'
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTitle sx={{ 
              bgcolor: '#003B7A', 
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
            }}>
              <Typography variant="h6" fontWeight="bold">
                Pago con Zigi
              </Typography>
              <IconButton
                onClick={onClose}
                sx={{ color: 'white' }}
              >
                ✕
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ 
              p: 3, 
              textAlign: 'center',
              overflowY: 'auto',
              maxHeight: 'calc(90vh - 80px)'
            }}>
              <Box sx={{ mb: 2, mt: 2 }}>
                <img 
                  src="/zigi.png" 
                  alt="Zigi" 
                  className="w-12 h-12 mx-auto mb-2"
                />
                <Typography variant="h6" fontWeight="bold" color="#003B7A" sx={{ mb: 1 }}>
                  Escanea el código QR para pagar
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Usa la aplicación de Zigi para escanear el código QR y completar tu pago de forma segura.
                </Typography>
              </Box>

              {/* Código QR */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 2,
                p: 1,
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid #e0e0e0'
              }}>
                <QRCode
                  value={linkPago}
                  size={150}
                  level="H"
                  fgColor="#003B7A"
                  bgColor="white"
                />
              </Box>

              {/* Enlace */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  O copia este enlace:
                </Typography>
                <Box sx={{ 
                  p: 1.5, 
                  bgcolor: '#f5f5f5', 
                  borderRadius: 1,
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  maxHeight: '60px',
                  overflowY: 'auto'
                }}>
                  {linkPago}
                </Box>
              </Box>

              {/* Botones */}
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  onClick={handleCopyLink}
                  size="small"
                  sx={{
                    borderColor: '#003B7A',
                    color: '#003B7A',
                    '&:hover': {
                      borderColor: '#002a5a',
                      backgroundColor: '#f0f8ff'
                    }
                  }}
                >
                  Copiar Enlace
                </Button>
                <Button
                  variant="contained"
                  onClick={handleOpenLink}
                  size="small"
                  sx={{
                    bgcolor: '#003B7A',
                    '&:hover': {
                      bgcolor: '#002a5a'
                    }
                  }}
                >
                  Abrir Enlace
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Una vez completado el pago, recibirás una confirmación por correo electrónico.
              </Typography>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
