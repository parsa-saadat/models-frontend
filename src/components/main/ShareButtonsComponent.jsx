import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faCopy, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const ShareButtons = () => {
  const url = encodeURIComponent(window.location.href);
  return (
    <div className="flex gap-2 mt-5">
      {[
        {
          href: `https://t.me/share/url?url=${url}`,
          icon: faTelegram,
        },
        {
          href: `https://wa.me/?text=${url}`,
          icon: faWhatsapp,
        },
        {
          href: `mailto:?subject=مشاهده این محصول&body=این محصول رو دیدم:\n${url}`,
          icon: faEnvelope,
        },
      ].map(({ href, icon }, idx) => (
        <a key={idx} href={href} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon
            icon={icon}
            className="text-white p-[10px] bg-[--color-black] hover:bg-[var(--color-main)] rounded text-[30px]"
          />
        </a>
      ))}
      <FontAwesomeIcon
        icon={faCopy}
        onClick={() => navigator.clipboard.writeText(window.location.href)}
        className="text-white py-[10px] px-[12px] bg-[--color-black] hover:bg-[var(--color-main)] rounded text-[30px] cursor-pointer"
      />
    </div>
  );
};

export default ShareButtons;
