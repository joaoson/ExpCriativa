import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function formatDateBRtoUS(date: string) {
  const [day, month, year] = date.split("/");
  // Create a Date object (format: yyyy-MM-dd)
  return new Date(`${year}-${month}-${day}`);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  // CPF checksum validation
  const calculateChecksum = (cpf: string, length: number) => {
    let sum = 0;
    let weight = length + 1;

    for (let i = 0; i < length; i++) {
      sum += parseInt(cpf[i]) * weight--;
    }

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateChecksum(cpf, 9);
  const secondDigit = calculateChecksum(cpf, 10);

  return cpf[9] === String(firstDigit) && cpf[10] === String(secondDigit);
};

export const validateCNPJ = (cnpj: string) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  let digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size += 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1));
};

export const phoneValidation = z.object({
  countryCode: z.enum(['BR', 'US', 'PT'], {
    errorMap: () => ({ message: "Please select a valid country" })
  }),
  phoneNumber: z.string()
}).refine(
  (data) => {
    // Remove all non-digit characters
    const cleanedNumber = data.phoneNumber.replace(/\D/g, '');

    switch (data.countryCode) {
      case 'BR': // Brazil
        // Brazilian phone numbers: 10-11 digits (with or without area code)
        return /^(\d{10,11})$/.test(cleanedNumber);
      case 'US': // United States
        // US phone numbers: exactly 10 digits
        return /^(\d{10})$/.test(cleanedNumber);
      case 'PT': // Portugal
        // Portuguese phone numbers: 9 digits
        return /^(\d{9})$/.test(cleanedNumber);
      default:
        return false;
    }
  },
  { message: "Invalid phone number format" }
);

export function formatCNPJ(cnpj: string) {
  return cnpj
    .slice(0, 14) 
    .replace(/^(\d{2})/, '$1.') 
    .replace(/^(\d{2})\.(\d{3})/, '$1.$2.')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})/, '$1.$2.$3/')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})/, '$1.$2.$3/$4-');
};

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}