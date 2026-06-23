// Constantes globais de contato
export const WHATSAPP_NUMBER = '5548988006788'
export const WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Charme Joias e Acessórios e gostaria de mais informações.'
export const INSTAGRAM_URL = 'https://www.instagram.com/charmejoiass/'

export const getWhatsAppLink = (message = WHATSAPP_MESSAGE) => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const getWhatsAppProductLink = (productName, productPrice) => {
    const message = `Olá! Tenho interesse no produto: ${productName} (${productPrice}). Virei pelo site da Charme Joias e Acessórios.`
    return getWhatsAppLink(message)
}
