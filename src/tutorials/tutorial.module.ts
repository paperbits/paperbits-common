import { IInjectorModule } from '../injection/IRegistration';
import { IInjector } from '../injection/IInjector';
import { Tutorial } from '../tutorials/tutorial';

export class TutorialModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tutorial", Tutorial);
    }
}