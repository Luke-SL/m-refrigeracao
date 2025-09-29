<template>
  <!-- rodapé desktop -->
  <div class="bg-blue-6 div-footer-desktop">
    <div class="row q-pa-md">
      <!-- Logo -->
      <div class="col-2 q-my-xl q-mx-lg">
        <q-img class="footer-logo" src="/logo/logo-footer.png" />
      </div>

      <!-- Formas de pagamento -->
      <div class="col-2">
        <p class="text-white text-bold text-body1">
          <q-icon name="mdi-credit-card-outline" size="md" /> Formas de pagamento
        </p>
        <div>
          <img src="/utils/flags/pix-banco-central-brasil-seeklogo.svg" class="pix-img" alt="Pix" />
        </div>

        <div class="row items-center q-gutter-x-sm no-wrap">
          <img
            src="/utils/flags/visa-svgrepo-com.svg"
            alt="Visa"
            class="q-icon payment-method-img"
          />
          <img
            src="/utils/flags/hipercard-3-svgrepo-com.svg"
            alt="Hipercard"
            class="q-icon payment-method-img"
          />
          <img
            src="/utils/flags/amex-svgrepo-com.svg"
            alt="American Express"
            class="q-icon payment-method-img"
          />
        </div>
        <div class="row items-center q-gutter-x-sm no-wrap">
          <img
            src="/utils/flags/hiper-svgrepo-com.svg"
            alt="Hiper"
            class="q-icon payment-method-img"
          />
          <img
            src="/utils/flags/mastercard-full-svgrepo-com.svg"
            alt="MasterCard"
            class="q-icon payment-method-img"
          />
          <img
            src="/utils/flags/elo-3-svgrepo-com.svg"
            alt="Elo"
            class="q-icon payment-method-img"
          />
        </div>
        <div>
          <img
            src="/utils/flags/infinitepay-seeklogo.svg"
            alt="InfinitePay"
            class="q-icon infinitepay-img"
          />
        </div>
      </div>
      <!-- Lojas físicas -->
      <div class="col-4">
        <p class="text-white text-bold text-body1">
          <q-icon name="mdi-store" size="md" /> Lojas físicas
        </p>
        <ul>
          <li><p class="text-white text-body1">Rua José Roque 44, Parelhas-RN 59360-000</p></li>
          <li>
            <p class="text-white text-body1">Rua Dr. Medeiros, Jardim do Sérido-RN 59343-000</p>
          </li>
          <li>
            <p class="text-white text-body1">
              Rua Tonheca Dantas, Carnaúba dos Dantas-RN 59374-000
            </p>
          </li>
        </ul>
      </div>

      <!-- Redes sociais -->
      <div class="col-3">
        <p class="text-white text-bold text-body1">
          <q-icon name="mdi-share-variant-outline" size="md" /> Redes sociais
        </p>

        <q-btn
          flat
          dense
          no-caps
          align="left"
          class="q-pa-none text-white text-body2"
          icon="mdi-instagram"
          label="@m_refrigeracaoparelhas"
          href="https://www.instagram.com/m_refrigeracaopar"
          target="_blank"
          rel="noopener noreferrer"
        />
      </div>
    </div>
    <q-separator inset />
    <div class="flex flex-center q-pa-md text-white">
      © 2025 M Refrigeração – CNPJ 20.528.877/0001-67 | Comércio de refrigeração com qualidade e
      confiança.
    </div>
  </div>
  <div class="bg-blue-6 div-footer-mobile text-white">
    <div class="mobile-footer-sections">
      <q-list>
        <q-expansion-item
          expand-icon-toggle
          expand-separator
          icon="mdi-credit-card-outline"
          label="Formas de pagamento"
          default-opened
        >
          <q-card>
            <q-card-section class="bg-blue-6">
              <div>
                <img
                  src="/utils/flags/pix-banco-central-brasil-seeklogo.svg"
                  alt="Pix"
                  class="pix-img"
                />
                <img
                  class="q-pl-sm infinitepay-img-mobile"
                  src="/utils/flags/infinitepay-seeklogo.svg"
                  alt="InfinitePay"
                />
              </div>

              <div class="row items-center q-gutter-x-sm no-wrap">
                <img
                  src="/utils/flags/visa-svgrepo-com.svg"
                  alt="Visa"
                  class="q-icon payment-method-img"
                />
                <img
                  src="/utils/flags/hipercard-3-svgrepo-com.svg"
                  alt="Hipercard"
                  class="q-icon payment-method-img"
                />
                <img
                  src="/utils/flags/amex-svgrepo-com.svg"
                  alt="American Express"
                  class="q-icon payment-method-img"
                />
                <img
                  src="/utils/flags/hiper-svgrepo-com.svg"
                  alt="Hiper"
                  class="q-icon payment-method-img"
                />
                <img
                  src="/utils/flags/mastercard-full-svgrepo-com.svg"
                  alt="MasterCard"
                  class="q-icon payment-method-img"
                />
                <img
                  src="/utils/flags/elo-3-svgrepo-com.svg"
                  alt="Elo"
                  class="q-icon payment-method-img"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item
          expand-icon-toggle
          expand-separator
          icon="mdi-store"
          label="Lojas físicas"
        >
          <q-card>
            <q-card-section class="bg-blue-6">
              <ul>
                <li>
                  <p class="text-white text-body2">Rua José Roque 44, Parelhas-RN 59360-000</p>
                </li>
                <li>
                  <p class="text-white text-body2">
                    Rua Dr. Medeiros, Jardim do Sérido-RN 59343-000
                  </p>
                </li>
                <li>
                  <p class="text-white text-body2">
                    Rua Tonheca Dantas, Carnaúba dos Dantas-RN 59374-000
                  </p>
                </li>
              </ul>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-icon-toggle
          expand-separator
          icon="mdi-share-variant-outline"
          label="Redes Sociais"
        >
          <q-card>
            <q-card-section class="bg-blue-6">
              <q-btn
                flat
                dense
                no-caps
                align="left"
                href="https://www.instagram.com/m_refrigeracaopar"
                target="_blank"
                rel="noopener noreferrer"
                class="text-white q-ml-xl text-body2"
                icon="mdi-instagram"
                label="@m_refrigeracaoparelhas"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
    <q-separator inset />

    <div class="flex flex-center q-pa-sm text-white">
      <p class="justify-center">
        © 2025 M Refrigeração – CNPJ 20.528.877/0001-67 | Comércio de refrigeração com qualidade e
        confiança.
      </p>
    </div>
  </div>
</template>
<style lang="sass" scoped>
ul
  list-style-type: none

.pix-img
  height: 32px

.infinitepay-img
  height: 64px
  width: 128px

.infinitepay-img-mobile
  height: 32px
  width: 64px

.payment-method-img
  height: 32px
  width: 32px

.mobile-footer-sections
  max-width: 85%
  margin: auto

@media (min-width: $breakpoint-md-min)
  .div-footer-desktop
    display: block
  .div-footer-mobile
    display: none

@media (max-width: $breakpoint-sm-max)
  .div-footer-desktop
    display: none
  .div-footer-mobile
    display: block
</style>
