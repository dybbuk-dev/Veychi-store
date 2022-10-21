import { useTranslation } from 'next-i18next';
import React from 'react';
import { Premium } from 'src/pages/[shop]/premium-info';
type setSelectedPremium = React.Dispatch<React.SetStateAction<Premium | null>>;
const PremiumPlanShower = ({
  premiumCards,
  setSelectedPremium,
}: {
  premiumCards: Premium[];
  setSelectedPremium: setSelectedPremium;
}) => {
  return (
    <div className="">
      <div className="text-center font-semibold">
        <h1 className="text-5xl">
          <span className="text-pink-500 tracking-wide">Planes </span>
          <span>Premium</span>
        </h1>
        <p className="pt-6 text-xl text-gray-400 font-normal w-full px-8 md:w-full">
          Selecciona un plan para recibir todos los beneficicios
          <br /> que tiene nuestra plataforma
        </p>
      </div>
      <div className="pt-24 flex flex-row flex-wrap gap-8 justify-center">
        {premiumCards.map((premiumCard) =>
          premiumCard.popular ? (
            <PopularPlan
              premium={premiumCard}
              setSelectedPremium={setSelectedPremium}
            />
          ) : (
            <NormalPlan
              premium={premiumCard}
              setSelectedPremium={setSelectedPremium}
            />
          )
        )}
      </div>
    </div>
  );
};

export default PremiumPlanShower;

const TickIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 text-green-500"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

const NormalPlan = ({
  premium,
  setSelectedPremium,
}: {
  premium: Premium;
  setSelectedPremium: setSelectedPremium;
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="min-w-[200px] p-8 bg-white text-center rounded-3xl pr-16 "
      style={{
        boxShadow:
          '0 10px 15px 5px rgb(0 0 0 / 0.1), 10 4px 6px -10px rgb(0 0 0 / 0.1)',
      }}
    >
      <h1
        className="text-black font-semibold text-2xl "
        style={{ minWidth: '200px' }}
      >
        {premium.title}
      </h1>
      <p className="pt-2 tracking-wide">
        <span className="text-gray-400 align-top">$ </span>
        <span className="text-3xl font-semibold">{premium.price}</span>
        <span className="text-gray-400 font-medium">
          / {premium.duration} {t('form:input-label-days')}
        </span>
      </p>
      <hr className="mt-4 border-1" />
      <div className="pt-8">
        {premium.traits.map((trait) => (
          <p className="font-semibold text-gray-400 text-left flex items-center">
            <span className="material-icons align-middle">
              <TickIcon />
            </span>
            <span className="pl-2">{trait}</span>
          </p>
        ))}

        <a href="#" className="" onClick={() => setSelectedPremium(premium)}>
          <p className="w-full py-4 bg-pink-600 mt-8 rounded-xl text-white">
            <span className="font-medium">Choose Plan</span>
          </p>
        </a>
      </div>
    </div>
  );
};

const PopularPlan = ({
  premium,
  setSelectedPremium,
}: {
  premium: Premium;
  setSelectedPremium: setSelectedPremium;
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-8 bg-gray-900 text-center rounded-3xl text-white border-4 shadow-xl border-white transform scale-110 ">
      <h1
        className="text-white font-semibold text-2xl "
        style={{ minWidth: '200px' }}
      >
        {premium.title}
      </h1>
      <p className="pt-2 tracking-wide">
        <span className="text-gray-400 align-top">$ </span>
        <span className="text-3xl font-semibold">{premium.price}</span>
        <span className="text-gray-400 font-medium">
          / {premium.duration} {t('form:input-label-days')}
        </span>
      </p>
      <hr className="mt-4 border-1 border-gray-600" />
      <div className="pt-8">
        {premium.traits.map((trait) => (
          <p className="font-semibold text-gray-400 text-left flex items-center">
            <span className="material-icons align-middle">
              <TickIcon />
            </span>
            <span className="pl-2">{trait}</span>
          </p>
        ))}

        <a href="#" className="" onClick={() => setSelectedPremium(premium)}>
          <p className="w-full py-4 bg-pink-600 mt-8 rounded-xl text-white">
            <span className="font-medium">Choose Plan</span>
          </p>
        </a>
      </div>
      <div className="absolute top-4 right-4">
        <p className="bg-pink-700 font-semibold px-4 py-1 rounded-full uppercase text-xs">
          Popular
        </p>
      </div>
    </div>
  );
};
