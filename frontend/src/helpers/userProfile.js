export const emptyUserProfileForm = {
  full_name: '',
  phone: '',
  cpf: '',
  zip_code: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
}

export const userProfileFields = [
  {
    name: 'full_name',
    label: 'Nome completo',
    autoComplete: 'name',
    placeholder: 'Seu nome completo',
  },
  {
    name: 'phone',
    label: 'Telefone',
    autoComplete: 'tel',
    placeholder: '11999999999',
  },
  {
    name: 'cpf',
    label: 'CPF',
    autoComplete: 'off',
    placeholder: 'Somente numeros',
  },
  {
    name: 'zip_code',
    label: 'CEP',
    autoComplete: 'postal-code',
    placeholder: '00000000',
  },
  {
    name: 'street',
    label: 'Rua',
    autoComplete: 'address-line1',
    placeholder: 'Rua, avenida ou alameda',
  },
  {
    name: 'number',
    label: 'Numero',
    autoComplete: 'address-line2',
    placeholder: 'Numero do endereco',
  },
  {
    name: 'complement',
    label: 'Complemento',
    autoComplete: 'address-line3',
    placeholder: 'Apto, bloco, referencia',
    required: false,
  },
  {
    name: 'neighborhood',
    label: 'Bairro',
    autoComplete: 'address-level3',
    placeholder: 'Seu bairro',
  },
  {
    name: 'city',
    label: 'Cidade',
    autoComplete: 'address-level2',
    placeholder: 'Sua cidade',
  },
  {
    name: 'state',
    label: 'UF',
    autoComplete: 'address-level1',
    placeholder: 'SP',
    maxLength: 2,
  },
]

export const buildUserProfilePayload = (form) => ({
  full_name: form.full_name.trim(),
  phone: form.phone.trim(),
  cpf: form.cpf.trim(),
  zip_code: form.zip_code.trim(),
  street: form.street.trim(),
  number: form.number.trim(),
  complement: form.complement.trim(),
  neighborhood: form.neighborhood.trim(),
  city: form.city.trim(),
  state: form.state.trim(),
})

export const getUserProfileFormValues = (user) => ({
  full_name: user?.full_name ?? '',
  phone: user?.phone ?? '',
  cpf: user?.cpf ?? '',
  zip_code: user?.zip_code ?? '',
  street: user?.street ?? '',
  number: user?.number ?? '',
  complement: user?.complement ?? '',
  neighborhood: user?.neighborhood ?? '',
  city: user?.city ?? '',
  state: user?.state ?? '',
})

export const formatFullAddress = (user) => {
  const parts = [
    [user?.street, user?.number].filter(Boolean).join(', '),
    user?.complement,
    user?.neighborhood,
    user?.city,
    user?.state,
    user?.zip_code,
  ]

  return parts.filter(Boolean).join(' - ')
}
