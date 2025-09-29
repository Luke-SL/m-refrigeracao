// src/utils/productUtils.js

export const getProductDescription = (product) => {
  if (!product) return ''

  if (product.category === 'air_conditioner') {
    return `Este ar condicionado foi projetado para oferecer conforto térmico em todas as estações,
            com baixo consumo de energia e funcionamento silencioso. Tecnologia inverter para
            maior eficiência energética e controle preciso da temperatura.`
  } else if (product.category === 'fan') {
    return `Ventilador com design moderno e eficiente, oferecendo múltiplas velocidades para
            máximo conforto. Construção robusta e funcionamento silencioso, ideal para
            residências e escritórios.`
  }
  return 'Produto de alta qualidade com excelente custo-benefício.'
}

export const getProductSpecs = (product) => {
  if (!product) return []

  const specs = []

  if (product.category === 'air_conditioner') {
    // Extrai informações do nome do produto
    const name = product.productName

    if (name.includes('9.000') || name.includes('9000')) {
      specs.push({ label: 'Capacidade', value: '9.000 BTU/h' })
    } else if (name.includes('12.000') || name.includes('12000')) {
      specs.push({ label: 'Capacidade', value: '12.000 BTU/h' })
    }

    if (name.includes('220V') || name.includes('220 V')) {
      specs.push({ label: 'Voltagem', value: '220V' })
    } else if (name.includes('127V') || name.includes('127 V')) {
      specs.push({ label: 'Voltagem', value: '127V' })
    }

    if (name.includes('Inverter')) {
      specs.push({ label: 'Tecnologia', value: 'Inverter' })
    }

    if (name.includes('Quente e Frio')) {
      specs.push({ label: 'Tipo', value: 'Quente e Frio' })
    } else {
      specs.push({ label: 'Tipo', value: 'Frio' })
    }

    // Marca
    if (name.includes('LG')) {
      specs.push({ label: 'Marca', value: 'LG' })
    } else if (name.includes('Agratto')) {
      specs.push({ label: 'Marca', value: 'Agratto' })
    } else if (name.includes('Samsung')) {
      specs.push({ label: 'Marca', value: 'Samsung' })
    } else if (name.includes('Elgin')) {
      specs.push({ label: 'Marca', value: 'Elgin' })
    } else if (name.includes('Gree')) {
      specs.push({ label: 'Marca', value: 'Gree' })
    }
  } else if (product.category === 'fan') {
    const name = product.productName

    // Marca
    if (name.includes('Arno')) {
      specs.push({ label: 'Marca', value: 'Arno' })
    } else if (name.includes('Britânia')) {
      specs.push({ label: 'Marca', value: 'Britânia' })
    } else if (name.includes('Mondial')) {
      specs.push({ label: 'Marca', value: 'Mondial' })
    } else if (name.includes('Cadence')) {
      specs.push({ label: 'Marca', value: 'Cadence' })
    }

    // Diâmetro
    if (name.includes('40cm')) {
      specs.push({ label: 'Diâmetro', value: '40cm' })
    } else if (name.includes('50cm')) {
      specs.push({ label: 'Diâmetro', value: '50cm' })
    }

    // Velocidades
    if (name.includes('3 Velocidades')) {
      specs.push({ label: 'Velocidades', value: '3 Velocidades' })
    }

    // Voltagem
    if (name.includes('220V')) {
      specs.push({ label: 'Voltagem', value: '220V' })
    } else if (name.includes('127V')) {
      specs.push({ label: 'Voltagem', value: '127V' })
    }

    // Potência
    if (name.includes('140W')) {
      specs.push({ label: 'Potência', value: '140W' })
    } else if (name.includes('150W')) {
      specs.push({ label: 'Potência', value: '150W' })
    }

    // Tipo
    if (name.includes('Mesa')) {
      specs.push({ label: 'Tipo', value: 'Mesa' })
    }
    if (name.includes('Parede')) {
      specs.push({ label: 'Tipo', value: 'Mesa e Parede' })
    }
  }

  specs.push({ label: 'Garantia', value: '1 ano' })

  return specs
}
