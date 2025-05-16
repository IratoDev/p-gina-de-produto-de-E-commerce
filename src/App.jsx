import { useState, useEffect } from 'react';
import axios from 'axios';

import { InputComponet } from './components/ui/input';
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

import './App.css';

const product = {
  title: 'Tênis Esportivo XYZ',
  price: 299.99,
  images: [
    '/img/tenis1.webp',
    '/img/tenis2.webp',
    '/img/tenis3.webp',
  ],
  variants: {
    sizes: ['38', '39', '40', '41', '42'],
    colors: ['Preto', 'Branco', 'Azul','Vermelho'],
  },
};

const STORAGE_KEY = 'ecommerce-product-state';

export default function App() {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (Date.now() - data.timestamp < 15 * 60 * 1000) {
        setMainImage(data.mainImage);
        setSelectedSize(data.selectedSize);
        setSelectedColor(data.selectedColor);
        setCep(data.cep);
        setAddress(data.address);
      }
    }
  }, []);

  useEffect(() => {
    const data = {
      mainImage,
      selectedSize,
      selectedColor,
      cep,
      address,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [mainImage, selectedSize, selectedColor, cep, address]);

  const handleCepSearch = async () => {
    if (cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.data.erro) {
          setAddress(response.data);
        } else {
          setAddress(null);
          alert('CEP não encontrado.');
        }
      } catch (error) {
        alert('Erro ao consultar o CEP: ' + error.message);
      }
    } else {
      alert('CEP inválido. Digite 8 dígitos.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div>
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-0">
              <img
                src={mainImage}
                alt="Produto"
                className="w-full rounded-t-2xl object-cover"
                style={{ maxHeight: '35vw' }}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3 mt-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Miniatura ${idx}`}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 rounded cursor-pointer border-2 object-cover ${mainImage === img ? 'border-blue-600' : 'border-transparent'}`}
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
          <p className="text-2xl text-green-600 font-semibold mb-6">R$ {product.price.toFixed(2)}</p>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Tamanho:</h2>
            <div className="flex flex-wrap gap-2">
              {product.variants.sizes.map(size => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Cor:</h2>
            <div className="flex flex-wrap gap-2">
              {product.variants.colors.map(color => (
                <Button
                  key={color}
                  variant={selectedColor === color ? 'default' : 'outline'}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Consultar Frete (CEP):</h2>
            <div className="flex items-center gap-2">
              <InputComponet
                value={cep}
                onChange={e => setCep(e.target.value)}
                placeholder="Digite o CEP"
                maxLength={8}
              />
              <Button onClick={handleCepSearch}>Buscar</Button>
            </div>
            {address && (
              <p className="mt-2 text-sm text-gray-600">
                {address.logradouro}, {address.bairro}, {address.localidade} - {address.uf}
              </p>
            )}
          </div>

          <Button className="w-full text-lg py-6">Adicionar ao Carrinho</Button>
        </div>
      </div>
    </div>
  );
}
