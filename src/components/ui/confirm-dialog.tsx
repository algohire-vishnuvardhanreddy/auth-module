'use client'

import React, { type JSX } from 'react'
import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'

export interface ConfirmDialogProps {
  /**
   * The title of the dialog
   */
  title: string
  /**
   * The description text of the dialog
   */
  description: string | JSX.Element
  /**
   * Function called when dialog open state changes
   */
  handleContinue?: () => void
  /**
   * Function called when confirm button is clicked
   */
  confirmHandler?: () => void
  /**
   * Function called when cancel button is clicked
   */
  cancelHandler?: () => void
  /**
   * Controls whether the dialog is open
   */
  isOpen: boolean
  /**
   * Text for the confirm button
   */
  confirmText?: string
  /**
   * Loading state for the confirm button
   */
  isConfirmLoading?: boolean
  /**
   * Variant for the confirm button
   */
  confirmButtonVariant?: ButtonVariant
  /**
   * Text for the cancel button
   */
  cancelText?: string
  /**
   * Variant for the cancel button
   */
  cancelButtonVariant?: ButtonVariant
  /**
   * Optional children to render inside the dialog trigger
   */
  children?: React.ReactNode
}

/**
 * A reusable confirmation dialog component
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  description,
  handleContinue = () => {},
  confirmHandler = () => {},
  cancelHandler = () => {},
  isOpen,
  confirmText = 'Confirm',
  isConfirmLoading = false,
  confirmButtonVariant = 'default',
  cancelText = 'Cancel',
  cancelButtonVariant = 'ghost',
  children,
}) => {
  return (
    <AlertDialog onOpenChange={handleContinue} open={isOpen}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancelText !== '' && (
            <Button variant={cancelButtonVariant} onClick={cancelHandler}>
              {cancelText}
            </Button>
          )}
          {isConfirmLoading ? (
            <Button size='sm' disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Processing ...
            </Button>
          ) : (
            <Button variant={confirmButtonVariant} onClick={confirmHandler}>
              {confirmText}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ConfirmDialog }
