import ButtonLogout from "@/components/button/button-logout";
import SelectTheme from "@/components/settings/select-theme";
import { useTheme } from "next-themes";

const AdminSettingsView = () => {
  const { setTheme, theme } = useTheme();
  return (
    <section className="lg:col-span-2 flex flex-col gap-4 pb-8 h-dvh">
      <div className="lg:border lg:border-gray-500 lg:rounded-lg lg:p-3 flex flex-col gap-4">
        <h1 className="text-2xl">General Settings</h1>
        <div className="mt-2 flex flex-col gap-3">
          <h3>Theme</h3>

          <SelectTheme
            value={theme || "system"}
            onChnage={(value) => setTheme(value)}
          />
        </div>
        <ButtonLogout />
      </div>
    </section>
  );
};

export default AdminSettingsView;
