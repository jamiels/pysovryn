import { showToast } from '@/utils/toast_helper.ts';

export const handleCopyString = (str: string) => {
  showToast('success', 'Copied to clipboard');
  navigator.clipboard.writeText(str);
};
