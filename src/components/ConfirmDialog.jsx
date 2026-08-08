import Dialog from './Dialog'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel }) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      actions={
        <>
          <button className="m3-btn text" onClick={onCancel}>Cancel</button>
          <button className={`m3-btn ${danger ? 'danger' : 'filled'}`} onClick={onConfirm}>{confirmLabel}</button>
        </>
      }
    >
      <p className="m3-body">{message}</p>
    </Dialog>
  )
}
