import { IInjector, IInjectorModule } from '../injection';
import { Tutorial } from '../tutorials/tutorial';

export class TutorialModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("tutorial", Tutorial);
    }
}