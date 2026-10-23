#!/usr/bin/env python3
"""
gerar_sons.py - Gera os sons do jogo "Clean Air Drone" por síntese (sem samples externos).

Todos os sons são criados aqui, a partir de ondas e ruído, por isso são ORIGINAIS:
não há ficheiros de terceiros nem licenças a creditar.

Como usar (precisa de Python 3 e numpy):
    python gerar_sons.py  pasta_de_destino

Gera, em formato .wav mono de 16 bits a 22050 Hz:
    cidade.wav        loop de 12 s: rumor do trânsito, textura e carros a passar
    ventoinha.wav     loop de 2 s: zumbido das pás + sopro de ar
    recolha_peq.wav   efeito de recolha, tom agudo  (partículas pequenas)
    recolha_med.wav   efeito de recolha, tom médio
    recolha_gra.wav   efeito de recolha, tom grave  (partículas grandes)
    vitoria.wav       arpejo ascendente (4 notas)
    derrota.wav       arpejo descendente (4 notas)
    powerup.wav       três notas rápidas a subir (power-up apanhado)
"""
import os
import sys
import wave

import numpy as np

SR = 22050                              # taxa de amostragem (amostras por segundo)
rng = np.random.default_rng(34668)      # semente fixa: gera sempre exatamente os mesmos sons


# ---------------------------------------------------------------- ferramentas
def ruido_periodico(duracao, f_min, f_max, inclinacao):
    """Ruído filtrado entre f_min e f_max (Hz) cujo FIM LIGA AO PRINCÍPIO sem corte.

    Constrói-se no domínio das frequências (cada frequência com fase aleatória) e converte-se
    para o tempo com a FFT inversa. Como a FFT assume que o sinal se repete, o resultado
    é perfeitamente periódico: ideal para loops. 'inclinacao' controla o brilho:
    valores altos dão sons mais graves (menos agudos).
    """
    n = int(duracao * SR)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    mag = np.zeros_like(freqs)
    banda = (freqs >= f_min) & (freqs <= f_max)
    mag[banda] = freqs[banda] ** (-inclinacao)
    fases = rng.uniform(0, 2 * np.pi, len(freqs))
    x = np.fft.irfft(mag * np.exp(1j * fases), n)
    return x / np.std(x)                # normaliza para desvio-padrão 1


def distancia_circular(t, t0, periodo):
    """Distância no tempo entre t e t0, contando que o fim do loop volta ao princípio."""
    d = np.abs(t - t0)
    return np.minimum(d, periodo - d)


def normalizar(x, pico=0.8):
    return x / np.max(np.abs(x)) * pico


def guardar(pasta, nome, x):
    caminho = os.path.join(pasta, nome)
    dados = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(caminho, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(dados.tobytes())
    print(f"{nome:18s} {len(x) / SR:5.2f} s  {os.path.getsize(caminho) / 1024:6.0f} KB")


# ---------------------------------------------------------------- os sons
def cidade():
    dur = 12.0
    t = np.arange(int(dur * SR)) / SR
    rumor = ruido_periodico(dur, 25, 500, 1.2) * 0.55         # trânsito distante (graves)
    textura = ruido_periodico(dur, 800, 5000, 0.5) * 0.05     # brilho do ar da cidade
    x = rumor + textura

    # Carros a passar: ruído de banda média com um "sino" de volume ao longo do tempo
    for t0, largura in [(2.0, 0.9), (5.2, 1.2), (8.0, 0.8), (10.3, 1.0)]:
        env = np.exp(-0.5 * (distancia_circular(t, t0, dur) / largura) ** 2)
        x += ruido_periodico(dur, 150, 1500, 1.0) * env * 0.45

    x *= 1 + 0.10 * np.sin(2 * np.pi * t / dur)               # respiração lenta do volume
    return normalizar(x)


def ventoinha():
    dur = 2.0
    t = np.arange(int(dur * SR)) / SR
    sopro = ruido_periodico(dur, 200, 4000, 0.3)
    # Frequências inteiras: cabem um número inteiro de vezes em 2 s -> o loop não tem corte
    zumbido = (np.sin(2 * np.pi * 110 * t) + 0.5 * np.sin(2 * np.pi * 220 * t)
               + 0.25 * np.sin(2 * np.pi * 330 * t))
    zumbido *= 1 + 0.25 * np.sin(2 * np.pi * 8 * t)           # as pás a passar (8 vezes/s)
    return normalizar(0.6 * sopro / 3 + 0.5 * zumbido / 2)


def recolha(f0):
    """Pequeno "ploc" brilhante: o tom sobe uma oitava em poucos milissegundos e desvanece."""
    dur = 0.35
    t = np.arange(int(dur * SR)) / SR
    freq = f0 * (2 - np.exp(-t / 0.03))                       # de f0 até 2*f0
    fase = 2 * np.pi * np.cumsum(freq) / SR
    onda = np.sin(fase) + 0.35 * np.sin(2 * fase)
    env = (1 - np.exp(-t / 0.004)) * np.exp(-t / 0.08)        # ataque rápido, queda suave
    env *= np.clip((dur - t) / 0.02, 0, 1)                    # fade final: evita estalidos
    return normalizar(onda * env)


def arpejo(notas, inicios, tau, dur, deslize=0.0):
    t = np.arange(int(dur * SR)) / SR
    x = np.zeros_like(t)
    for i, (f, t0) in enumerate(zip(notas, inicios)):
        local = np.clip(t - t0, 0, None)
        ultima = i == len(notas) - 1
        env = (t >= t0) * (1 - np.exp(-local / 0.005)) * np.exp(-local / (tau * (2.2 if ultima else 1)))
        f_inst = f * (1 - deslize * local) if ultima else f
        fase = 2 * np.pi * np.cumsum(np.where(t >= t0, f_inst, 0)) / SR
        x += env * (np.sin(fase) + 0.3 * np.sin(2 * fase) + 0.1 * np.sin(3 * fase))
    x *= np.clip((dur - t) / 0.05, 0, 1)
    return normalizar(x)


def vitoria():
    return arpejo([523.25, 659.25, 783.99, 1046.5], [0, 0.16, 0.32, 0.48], 0.22, 1.5)


def derrota():
    return arpejo([392.0, 349.23, 311.13, 261.63], [0, 0.22, 0.44, 0.66], 0.30, 1.7, deslize=0.04)


def powerup():
    return arpejo([659.25, 880.0, 1318.51], [0, 0.08, 0.16], 0.18, 0.7)


if __name__ == "__main__":
    pasta = sys.argv[1] if len(sys.argv) > 1 else "."
    os.makedirs(pasta, exist_ok=True)
    guardar(pasta, "cidade.wav", cidade())
    guardar(pasta, "ventoinha.wav", ventoinha())
    guardar(pasta, "recolha_peq.wav", recolha(700))
    guardar(pasta, "recolha_med.wav", recolha(520))
    guardar(pasta, "recolha_gra.wav", recolha(380))
    guardar(pasta, "vitoria.wav", vitoria())
    guardar(pasta, "derrota.wav", derrota())
    guardar(pasta, "powerup.wav", powerup())
