import React from 'react';

const CombinedMakharijChart = () => {
  const makharijData = [
    {
      area: "الجوف (Al-Jawf)",
      description: "الحروف المدية، وهي الألف المرققة الغير الممالة",
      letters: [
        { letter: "ا", description: "الألف المرققة الغير الممالة" },
        { letter: "و", description: "الواو المدية" },
        { letter: "ي", description: "الياء المدية" }
      ]
    },
    {
      area: "الحلق (Al-Halq)",
      description: "مخارج الحروف من الحلق",
      letters: [
        { letter: "ء", description: "من أقصى الحلق مما يلي الصدر" },
        { letter: "ه", description: "من أقصى الحلق" },
        { letter: "ع", description: "من وسط الحلق" },
        { letter: "ح", description: "من وسط الحلق" },
        { letter: "غ", description: "من أدنى الحلق" },
        { letter: "خ", description: "من أدنى الحلق" }
      ]
    },
    {
      area: "اللسان (Al-Lisan)",
      description: "مخارج الحروف من اللسان",
      letters: [
        { letter: "ق", description: "من أعلى أقصى اللسان وما فوقه من الحنك الأعلى" },
        { letter: "ك", description: "من أسفله" },
        { letter: "ج", description: "من وسط اللسان" },
        { letter: "ش", description: "من وسط اللسان" },
        { letter: "ي", description: "من وسط اللسان (غير المدية)" },
        { letter: "ض", description: "من حافة اللسان" },
        { letter: "ل", description: "اللام المرققة من أدنى الحافة يليها مع اللثة العليا" },
        { letter: "ن", description: "النون المظهرة من طرفه مع ما يوازيه تحت اللام" },
        { letter: "ر", description: "من ظهره بعيد طرفه مع ما يحاذيه" },
        { letter: "ط", description: "من طرفه مع أصول الثنايا العليا" },
        { letter: "د", description: "من طرفه مع أصول الثنايا العليا" },
        { letter: "ت", description: "من طرفه مع أصول الثنايا العليا" },
        { letter: "ص", description: "من طرفه مع صفحتي الثنيتين العليين" },
        { letter: "س", description: "من طرفه مع صفحتي الثنيتين العليين" },
        { letter: "ز", description: "من طرفه مع صفحتي الثنيتين العليين" },
        { letter: "ظ", description: "من طرفه مع أطراف الثنايا العليا" },
        { letter: "ذ", description: "من طرفه مع أطراف الثنايا العليا" },
        { letter: "ث", description: "من طرفه مع أطراف الثنايا العليا" }
      ]
    },
    {
      area: "الشفتان (Ash-Shafatan)",
      description: "مخارج الحروف من الشفتين",
      letters: [
        { letter: "ف", description: "من بطن الشفة السفلى مع أطراف الثنايا العليا" },
        { letter: "ب", description: "من الشفتين" },
        { letter: "م", description: "الميم المظهرة من الشفتين" },
        { letter: "و", description: "الواو الغير المدية من الشفتين" }
      ]
    },
    {
      area: "الخيشوم (Al-Khayshum)",
      description: "مخرج الغنة",
      letters: [
        { letter: "ن", description: "النون المخفاة والمدغمة" },
        { letter: "م", description: "الميم المخفاة والمدغمة" }
      ]
    },
    {
      area: "الأسنان (Al-Asnan)",
      description: "ثنتان وثلاثون، نصفها في الأعلى ونصفها في الأسفل",
      details: [
        { name: "الثنيتان", position: "في الأعلى المقدمتان" },
        { name: "الرباعية", position: "تليهما يمينا وشمالا" },
        { name: "الناب", position: "تليهما كذلك" },
        { name: "الأضراس", position: "الباقي، منها ضاحك تال للنابين" },
        { name: "الطواحن", position: "تليهما ثلاثة يمينا وثلاثة شمالا" },
        { name: "النواجذ", position: "ثم الواحد كذلك" }
      ]
    }
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Combined Makharij Chart</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Area</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Letters and Details</th>
            </tr>
          </thead>
          <tbody>
            {makharijData.map((area, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-2 font-bold text-right" dir="rtl">{area.area}</td>
                <td className="border border-gray-300 p-2 text-right" dir="rtl">{area.description}</td>
                <td className="border border-gray-300 p-2">
                  {area.letters && (
                    <ul className="list-disc list-inside">
                      {area.letters.map((item, letterIndex) => (
                        <li key={letterIndex} className="text-right" dir="rtl">
                          <span className="font-bold">{item.letter}</span>: {item.description}
                        </li>
                      ))}
                    </ul>
                  )}
                  {area.details && (
                    <ul className="list-disc list-inside">
                      {area.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-right" dir="rtl">
                          <span className="font-bold">{detail.name}</span>: {detail.position}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-gray-600">Note: This comprehensive chart combines information from both images, providing a detailed overview of the articulation points (makharij) of Arabic letters and the structure of teeth involved in pronunciation.</p>
    </div>
  );
};

export default CombinedMakharijChart;
